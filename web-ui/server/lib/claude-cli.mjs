/**
 * Claude CLI subprocess provider. Routes live evaluation through
 * `claude --print` (Claude Code CLI) so the user's existing subscription
 * is used instead of a raw ANTHROPIC_API_KEY.
 *
 * Detection: `claude --version` is run once at import time and cached.
 * Execution: the assembled prompt is written to the child's stdin so
 * there's no shell arg-length limit (prompts can be up to 200 KB).
 *
 * Return shape mirrors runAnthropic / runOpenAI:
 *   { markdown: string, usage: null, error: string|null }
 * `usage` is always null — the CLI emits no token counts.
 */
import { spawn, spawnSync } from 'node:child_process';
import { cleanLlmMarkdown } from './llm-output.mjs';

// Detect once and cache. spawnSync avoids async complexity at import time.
function _detectClaude() {
  try {
    const r = spawnSync('claude', ['--version'], { timeout: 5000, encoding: 'utf8' });
    return r.status === 0;
  } catch {
    return false;
  }
}
let _claudeAvailable = null;

/**
 * Returns true when the `claude` CLI binary is on PATH and responds.
 * Set DISABLE_CLAUDE_CLI=1 in process.env to suppress for testing.
 */
export function hasClaudeCli() {
  if (process.env.DISABLE_CLAUDE_CLI === '1') return false;
  if (_claudeAvailable === null) _claudeAvailable = _detectClaude();
  return _claudeAvailable;
}

/**
 * Run a prompt through `claude --print` (non-interactive mode).
 * Writes the prompt to the child's stdin to handle large payloads safely.
 *
 * @param {string} prompt
 * @param {{ timeoutMs?: number, allowedTools?: string[] }} opts
 *   allowedTools: tools to enable (e.g. ['WebSearch']). Without this flag
 *   the CLI runs in a piped context that denies tool use by default.
 * @returns {{ markdown: string, usage: null, error: string|null }}
 */
export async function runClaudeCli(prompt, opts = {}) {
  const timeoutMs = opts.timeoutMs || 180_000;

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;

    const args = ['--print'];
    if (opts.allowedTools && opts.allowedTools.length) {
      args.push('--allowedTools', opts.allowedTools.join(','));
    }

    const child = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 5000);
      resolve({ markdown: '', usage: null, error: 'timeout' });
    }, timeoutMs);

    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      if (code !== 0) {
        const detail = stderr.trim().slice(0, 300) || `exit code ${code}`;
        resolve({ markdown: '', usage: null, error: `Claude CLI: ${detail}` });
        return;
      }
      resolve({ markdown: cleanLlmMarkdown(stdout.trim()), usage: null, error: null });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({ markdown: '', usage: null, error: `Claude CLI: ${err.message}` });
    });

    // Write prompt via stdin and close so the child knows input is done.
    try {
      child.stdin.write(prompt, 'utf8');
      child.stdin.end();
    } catch (err) {
      clearTimeout(timer);
      if (!settled) {
        settled = true;
        resolve({ markdown: '', usage: null, error: `Claude CLI stdin: ${err.message}` });
      }
    }
  });
}
