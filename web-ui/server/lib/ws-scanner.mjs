/**
 * WebSearch scanner — executes portals.yml `search_queries` (and
 * `senior_pm_search_queries`) via `claude --print` so the model's
 * WebSearch tool discovers jobs on India-specific boards (Naukri,
 * Cutshort, iimjobs, Foundit, LinkedIn India, Wellfound, …) that
 * have no direct ATS API.
 *
 * Requires Claude CLI to be installed and on PATH (`claude --version`).
 * Falls back with a clear error if unavailable.
 *
 * Return shape mirrors en-scanner / ru-scanner:
 *   { counts: { raw, dup, fresh }, fresh: Job[], errors: string[] }
 *
 * Each Job: { url, title, company, location, source }
 */
import { readFileSync, existsSync, appendFileSync, writeFileSync, mkdirSync } from 'node:fs';
import yaml from 'js-yaml';
import { PATHS } from './paths.mjs';
import { addPipelineUrl } from './parsers.mjs';
import { hasClaudeCli, runClaudeCli } from './claude-cli.mjs';
import { saveLastScan, MAX_STORED_RESULTS } from './en-scanner.mjs';

// ─── portals.yml helpers ────────────────────────────────────────────────────

function loadPortals() {
  if (!existsSync(PATHS.portals)) return {};
  try { return yaml.load(readFileSync(PATHS.portals, 'utf8')) || {}; } catch { return {}; }
}

/**
 * Returns all enabled search-query entries across the two keys that
 * portals.yml uses: `search_queries` and `senior_pm_search_queries`.
 * Each entry: { name: string, query: string }
 */
export function loadSearchQueries() {
  const p = loadPortals();
  const all = [
    ...(p.search_queries || []),
    ...(p.senior_pm_search_queries || []),
  ];
  return all.filter((q) => q.enabled !== false && typeof q.query === 'string' && q.query.trim());
}

// ─── dedup helpers ──────────────────────────────────────────────────────────

function loadSeenUrls() {
  const seen = new Set();
  for (const p of [PATHS.scanHistory, PATHS.pipeline, PATHS.applications]) {
    try {
      const text = readFileSync(p, 'utf8');
      for (const m of text.matchAll(/https?:\/\/\S+/g)) seen.add(m[0]);
    } catch {}
  }
  return seen;
}

function loadSeenCompanyRoles() {
  const seen = new Set();
  try {
    const text = readFileSync(PATHS.applications, 'utf8');
    for (const m of text.matchAll(/^\|[^|]+\|[^|]+\|([^|]+)\|([^|]+)\|/gm)) {
      const company = m[1].trim().toLowerCase();
      const role = m[2].trim().toLowerCase();
      if (company && role && company !== 'company') seen.add(`${company}::${role}`);
    }
  } catch {}
  return seen;
}

// ─── JSON extraction from claude --print output ─────────────────────────────

/**
 * Robustly pull a JSON array out of `claude --print` stdout. The model
 * outputs the array directly, but may wrap it in a markdown fence or
 * add a brief preamble. We try three strategies in order.
 */
function extractJsonArray(text) {
  const s = text.trim();
  // 1. Direct parse
  try { const v = JSON.parse(s); if (Array.isArray(v)) return v; } catch {}
  // 2. Strip leading/trailing markdown fences (```json … ```)
  const fenced = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { const v = JSON.parse(fenced); if (Array.isArray(v)) return v; } catch {}
  // 3. Extract the first [...] block from anywhere in the text
  const m = s.match(/\[[\s\S]*?\]/);
  if (m) { try { const v = JSON.parse(m[0]); if (Array.isArray(v)) return v; } catch {} }
  return [];
}

// ─── pipeline / history writers ─────────────────────────────────────────────

function appendToPipeline(jobs) {
  let content = '';
  try { content = readFileSync(PATHS.pipeline, 'utf8'); } catch {}
  let updated = content;
  for (const j of jobs) updated = addPipelineUrl(updated, j.url);
  mkdirSync(PATHS.pipeline.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(PATHS.pipeline, updated);
}

function appendToHistory(jobs) {
  mkdirSync(PATHS.scanHistory.replace(/\/[^/]+$/, ''), { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  if (!existsSync(PATHS.scanHistory)) {
    writeFileSync(PATHS.scanHistory, 'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\n');
  }
  const lines = jobs.map((j) =>
    [j.url, date, j.source || 'websearch', j.title, j.company, 'added']
      .map((x) => String(x ?? '').replace(/\t/g, ' '))
      .join('\t')
  );
  appendFileSync(PATHS.scanHistory, lines.join('\n') + '\n');
}

// ─── per-query prompt ────────────────────────────────────────────────────────

function buildSearchPrompt(queryEntry) {
  return `Use the WebSearch tool to search for job listings with this exact query:
${queryEntry.query}

After searching, return ONLY a valid JSON array (no other text, no markdown fences):
[{"url":"https://...","title":"Job Title","company":"Company Name","location":"City or Remote"}]

Rules:
- Only include direct job posting URLs (company career pages, ATS board pages — not search engine result pages)
- Each job must have a real, specific URL linking to the individual posting
- Skip duplicate companies if they appear multiple times for the same role
- If no valid job postings are found, return exactly: []
`;
}

// ─── main runner ─────────────────────────────────────────────────────────────

/**
 * Run all enabled search_queries from portals.yml through claude --print.
 *
 * Options (mirrors en-scanner / ru-scanner interface):
 *   writeFiles  (default true) — append to pipeline.md + scan-history.tsv + last-scan.json
 *   signal      — AbortSignal to cancel mid-run
 *   onLog(stream, line)
 *   onProgress(done, total)
 */
export async function runWsScan(opts = {}) {
  const { writeFiles = true, onLog = () => {}, onProgress = () => {}, signal } = opts;
  const log = (s, line) => onLog(s, line);

  log('stdout', '━'.repeat(60));
  log('stdout', `WebSearch Scan — ${new Date().toISOString().slice(0, 10)}`);
  log('stdout', '━'.repeat(60));

  if (!hasClaudeCli()) {
    const msg = 'Claude CLI not found. Install Claude Code (claude.ai/code) and ensure `claude` is on PATH to use WebSearch scanning.';
    log('stderr', `✗ ${msg}`);
    return { counts: { raw: 0, dup: 0, fresh: 0 }, fresh: [], errors: [msg] };
  }

  const queries = loadSearchQueries();
  if (!queries.length) {
    log('stdout', 'No search_queries found in portals.yml — nothing to do.');
    return { counts: { raw: 0, dup: 0, fresh: 0 }, fresh: [], errors: [] };
  }

  const seen = loadSeenUrls();
  const seenCompanyRoles = loadSeenCompanyRoles();
  log('stdout', `Queries:       ${queries.length}`);
  log('stdout', `Already seen:  ${seen.size} URLs`);
  log('stdout', '');

  const allRaw = [];
  const errors = [];

  for (let i = 0; i < queries.length; i++) {
    if (signal?.aborted) break;
    const q = queries[i];
    onProgress(i, queries.length);
    log('stdout', `  [${i + 1}/${queries.length}] ${q.name}`);

    const prompt = buildSearchPrompt(q);
    const r = await runClaudeCli(prompt, { timeoutMs: 90_000 });

    if (r.error) {
      const errMsg = `${q.name}: ${r.error}`;
      log('stderr', `    ✗ ${errMsg}`);
      errors.push(errMsg);
      continue;
    }

    const jobs = extractJsonArray(r.markdown);
    // Normalise: ensure each job has url, title, company, location, source
    const valid = jobs
      .filter((j) => j && typeof j.url === 'string' && j.url.startsWith('http'))
      .map((j) => ({
        url: j.url.trim(),
        title: (j.title || '').trim(),
        company: (j.company || '').trim(),
        location: (j.location || '').trim(),
        source: 'websearch',
        _queryName: q.name,
      }));

    log('stdout', `    → ${valid.length} job(s) found`);
    allRaw.push(...valid);
  }
  onProgress(queries.length, queries.length);

  // Dedup
  const fresh = allRaw.filter((j) => {
    if (seen.has(j.url)) return false;
    const key = `${j.company.toLowerCase()}::${j.title.toLowerCase()}`;
    return !seenCompanyRoles.has(key);
  });
  // Track newly added within this run so we don't double-count
  const addedUrls = new Set();
  const dedupedFresh = fresh.filter((j) => {
    if (addedUrls.has(j.url)) return false;
    addedUrls.add(j.url);
    return true;
  });
  const dup = allRaw.length - dedupedFresh.length;

  log('stdout', '');
  log('stdout', '━'.repeat(60));
  log('stdout', `Total found:        ${allRaw.length}`);
  log('stdout', `Dedup (seen):       ${dup} skipped`);
  log('stdout', `New offers added:   ${dedupedFresh.length}`);
  log('stdout', '━'.repeat(60));

  if (writeFiles) {
    if (dedupedFresh.length) {
      appendToPipeline(dedupedFresh);
      appendToHistory(dedupedFresh);
      log('stdout', `→ Appended ${dedupedFresh.length} URLs to data/pipeline.md`);
    }
    saveLastScan({
      kind: 'ws',
      when: new Date().toISOString(),
      fresh: dedupedFresh,
      filtered: dedupedFresh.slice(0, MAX_STORED_RESULTS),
      errors,
    });
  }

  if (errors.length) {
    log('stderr', '');
    log('stderr', `${errors.length} error(s) above.`);
  }

  return {
    counts: { raw: allRaw.length, dup, fresh: dedupedFresh.length },
    fresh: dedupedFresh,
    errors,
  };
}
