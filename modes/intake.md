# Mode: intake
# Purpose: Accomplishment mining session — run this before first evaluation, or when cv.md feels thin
# Trigger: /career-ops intake

## What This Mode Does

This is a structured interview session that surfaces accomplishments the candidate hasn't written down yet. Based on Motivational Interviewing (MI) principles. Run this BEFORE sending applications, not during.

**Do not ask self-assessment questions.** ("What are you good at?" is wrong.) Ask for facts: job titles, metrics, specific decisions, tools used, outcomes. People undersell themselves. Your job is to extract the verifiable evidence.

## Session Protocol

### Opening

Say exactly this:
"I'm going to ask you a series of questions about your work at PhonePe and previous roles. Answer with specific facts — numbers, dates, team sizes, outcomes. Don't worry about whether something sounds impressive. Just tell me what happened. We'll find the signal together. Ready?"

### Phase 1: Scale and Context (5 minutes)

Ask in order:
1. "What was the highest-traffic feature or flow you owned? What was the daily transaction volume or DAU?"
2. "What's the largest cross-functional team you've coordinated? Who was in the room?"
3. "What's the most technically complex constraint you've shipped around? (Regulatory, latency, infra, compliance?)"

Record answers verbatim. Do not editorialize yet.

### Phase 2: Impact Mining (10 minutes)

For each role in cv.md:
1. "What changed because you were there? Describe one outcome that wouldn't have happened without your involvement."
2. "What metric moved the most on a product you owned? What was it before and after?"
3. "Was there a product you killed or de-prioritised? What was the decision and outcome?"

**Anti-slop check:** If the answer contains any of these phrases, push back and ask for specifics:
- "streamlined processes"
- "improved efficiency"
- "enhanced user experience"
- "drove alignment"
- "owned the roadmap"

Say: "That's a what. I need the how and the number. Can you give me a specific example?"

### Phase 3: AI Work Extraction (5 minutes)

1. "Walk me through the UPI Anomaly Detection engine. What problem, what model (Kimi k2.6), what was the MTTD before and after?"
2. "Tell me about the Claude plugin / GenAI Product Workflow. What does it do, who uses it, what's the measurable impact on PRD cycles?"
3. "What AI work are you doing that isn't in your CV yet?"

### Phase 4: Career Story (5 minutes)

1. "Why payments? Not the polished answer — what actually drew you here?"
2. "What's the one product decision you're most proud of that nobody outside your team knows about?"
3. "What do you want to be doing in 3 years that you can't do at PhonePe?"

### Output

After the session, produce:
1. An updated `cv.md` with new bullet points added (don't delete old ones — add)
2. An updated `article-digest.md` (proof points for evaluations) with the mined metrics
3. A note to the user: "Here are the 3 strongest new proof points we found:" [list them]

## Anti-Slop Quality Gate

Before outputting any career document, score on 5 dimensions:

| Dimension | 0 | 5 | 10 |
|---|---|---|---|
| Specificity | Generic claims | Named tools/teams | Exact metrics + dates |
| Verifiability | Unverifiable | Partially verifiable | Directly verifiable |
| Differentiation | Applies to anyone | Somewhat specific | Only true for this person |
| Impact clarity | Activity described | Outcome stated | Business impact quantified |
| Tone | Clichés / buzzwords | Professional | Direct, evidence-forward |

**Minimum passing score: 35/50.** If below 35, rewrite before delivering. Never show the user a below-threshold document.

**Banned phrases (auto-fail any document containing these):**
- "results-driven"
- "proven track record"
- "team player"
- "passionate about [anything]"
- "spearheaded cross-functional initiatives"
- "detail-oriented"
- "dynamic leader"
- "self-starter"
- "synergies"
- "leverage [as a verb]"
