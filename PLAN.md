# career-ops-devang: Implementation Plan

> **For Claude Code:** Read this entire document before touching any file. Execute tasks in order. Each task has a ✅ verification step — do not proceed to the next task until verification passes. When a step says **[DEVANG DOES THIS]**, stop and wait for confirmation before continuing.

**Goal:** Build a customised fork of career-ops-india that evaluates both AI PM and Fintech PM roles for a Senior PM at PhonePe, with Indian unicorn portals, dual-track CV framing, and a passive-search scoring mode.

**Architecture:** Fork career-ops-india as the base (inherits GLS, CTC/LPA framework, India portals). All customisation lives in `modes/` and `config/` — infrastructure scripts (scan.mjs, generate-pdf.mjs, etc.) are never touched. Two new archetype mode files are added; existing modes are surgically modified. The system remains upstream-rebassable.

**Tech Stack:** Node.js 18+, Claude Code (Anthropic API), Playwright, Go (optional, for dashboard). YAML for config, Markdown for all mode/CV files.

**Owner:** Devang (Senior PM, PhonePe, Bengaluru). Target roles: Senior AI PM (global AI companies + Indian AI-first startups) and Senior Fintech PM (Indian unicorns, GCCs, BFSI).

---

## PRE-FLIGHT: Manual Steps (Devang Does These Before Running Claude Code)

These cannot be automated. Do them in order. If any step fails, **do not proceed**.

### Step PF-1: Verify Node.js

Open Terminal and run:

```bash
node --version
```

**Expected:** `v18.x.x` or higher. If you see `command not found` or a version below 18, download from https://nodejs.org (choose the LTS version) and reinstall.

---

### Step PF-2: Verify Claude Code

```bash
claude --version
```

**Expected:** Any version number. If `command not found`, install via: `npm install -g @anthropic-ai/claude-code`

---

### Step PF-3: Verify Git

```bash
git --version
```

**Expected:** Any version. If missing: `brew install git` (Mac) or download from https://git-scm.com.

---

### Step PF-4: Fork and Clone the Repo

1. Open https://github.com/itsmedhawal/career-ops-india in your browser
2. Click the **Fork** button (top right) → Fork to your own GitHub account
3. Name it `career-ops-devang` (or keep as career-ops-india — your choice)
4. In Terminal, run:

```bash
cd ~
git clone https://github.com/YOUR_GITHUB_USERNAME/career-ops-devang.git
cd career-ops-devang
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

### Step PF-5: Install Dependencies

```bash
npm install
npx playwright install chromium
```

The second command downloads Chromium for portal scanning and PDF generation. It's ~170MB — expect it to take a few minutes.

---

### Step PF-6: Set Your Anthropic API Key

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Replace `your-api-key-here` with your actual key from https://console.anthropic.com. To make this permanent (so you don't re-run it every session), add the line to your `~/.zshrc` or `~/.bash_profile`:

```bash
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

---

### Step PF-7: Run the Doctor Check

```bash
npm run doctor
```

**Expected output:** All checks should pass (green ✓). If any check fails, fix it before continuing. Common fixes:
- `playwright not found` → re-run `npx playwright install chromium`
- `API key not set` → re-check Step PF-6
- `Node version too old` → re-install Node.js from Step PF-1

---

### Step PF-8: Open the Project in Claude Code

```bash
cd ~/career-ops-devang
claude
```

Claude Code will open. You are now ready to run the plan. **Tell Claude Code:** *"Please follow the implementation plan in PLAN.md. Start at Phase 1 and confirm with me at each phase checkpoint before proceeding."*

---

## FILE MAP

Before any changes, here is the complete picture of what will be created and modified:

### Files Claude Code Creates (New)
| File | Purpose |
|---|---|
| `cv.md` | Your CV in markdown — the brain of the system. **You fill this in.** |
| `config/profile.yml` | Your preferences, target roles, compensation expectations |
| `portals.yml` | Indian unicorn + global AI company portal config |
| `modes/fintech-pm.md` | Archetype: Senior Fintech PM evaluation logic |
| `modes/ai-pm-india.md` | Archetype: Senior AI PM evaluation logic (India-aware) |
| `modes/intake.md` | Accomplishment mining session mode (poferraz approach) |
| `DEVANG_CHANGES.md` | Diff log — what changed from upstream and why |

### Files Claude Code Modifies (Surgical Edits Only)
| File | What Changes |
|---|---|
| `modes/_shared.md` | Add dual-track framing context, quality gate instructions, passive-search scoring note |
| `modes/oferta.md` | Extend archetype detection block to include `fintech-pm` and `ai-pm-india` |
| `modes/batch.md` | Add new archetypes to the batch processor's archetype list |

### Files Claude Code Never Touches
```
scan.mjs, generate-pdf.mjs, generate-latex.mjs, doctor.mjs,
dedup-tracker.mjs, merge-tracker.mjs, normalize-statuses.mjs,
followup-cadence.mjs, analyze-patterns.mjs, verify-pipeline.mjs,
dashboard/ (all Go files), package.json, flake.nix
```

---

## PHASE 1: Profile Foundation

> **CTO Note:** Garbage in, garbage out. This is the highest-leverage phase. A weak profile means every evaluation the system produces will be wrong. Spend real time on cv.md.

### Task 1.1: Create cv.md

**Files:** Create `cv.md` in project root.

- [ ] **Step 1:** Create the file with this scaffold:

```markdown
# Devang [Last Name]
Senior Product Manager | Fintech & AI Products | Bengaluru

**Email:** [your email]
**LinkedIn:** linkedin.com/in/[your handle]
**Location:** Bengaluru, India (open to remote / hybrid)

---

## Professional Summary

[2–3 sentences. Write this last. Should capture: your UPI/payments depth, your AI product work, and what you're optimising for next. Example: "Senior PM with X years building UPI-scale payment products at PhonePe. Currently building AI-native features with Gemini and Claude. Targeting senior PM roles at the intersection of fintech infrastructure and AI product."]

---

## Experience

### PhonePe | Senior Product Manager | [Start Date] – Present
*India's largest UPI payments platform. X crore MAU, Y% UPI market share.*

**UPI Core / [Your Team Name]**
- [Achievement 1 — format: Action + metric + business impact. E.g., "Led UPI Biometric Auth rollout across X merchant categories, reducing payment failure rate by Y%."]
- [Achievement 2]
- [Achievement 3]

**AI Product Work (if applicable)**
- [E.g., "Implemented Gemini Flash for [use case], reducing [X] by [Y%]."]
- [E.g., "Designed Product Brain: internal PM copilot using Claude, reducing spec prep time by [X hours/week]."]

### [Previous Company] | [Role] | [Dates]
- [Achievement 1]
- [Achievement 2]

---

## Products Shipped

| Product | Impact | Stage |
|---|---|---|
| [Product Name] | [Key metric] | [Live / Beta / Sunset] |

---

## Skills

**Domain:** UPI, IMPS, NACH, payment gateway infrastructure, NPCI ecosystem, RBI compliance, PCI-DSS awareness
**AI/ML:** LLM integration (Claude, Gemini), prompt engineering, evals, agentic workflows, RAG, Claude Code
**Tools:** Zerodha Kite (data analysis), Figma, Mixpanel/Amplitude, JIRA, SQL basics
**Frameworks:** Jobs-to-be-done, opportunity solution trees, RICE prioritisation

---

## Education

[Degree, Institution, Year]

---

## Proof Points (for career-ops evaluation)

<!-- This section is read by career-ops at evaluation time. Be specific and metric-heavy. -->

- **Scale:** Built on UPI infrastructure processing [X] transactions/day at [Y]ms p99
- **Impact:** [Your best metric — e.g., "Increased biometric auth adoption from X% to Y% in 6 months"]
- **AI work:** [Specific AI product shipped, model used, outcome]
- **Cross-functional:** Led [X]-person cross-functional team across [engineering / design / compliance / ops]
- **Regulatory:** [Any RBI / NPCI / compliance-relevant work]
```

**⚠️ [DEVANG DOES THIS]:** Fill in the actual content. Do not leave brackets. The quality of every evaluation the system produces is directly proportional to how good this file is. Aim for 10–15 real bullet points across your roles. Spend 45 minutes on this.

- [ ] **Step 2:** Once Devang confirms cv.md is filled in, run:

```bash
wc -l cv.md
```

**Expected:** At least 40 lines. If under 40, the CV is likely too thin — ask Devang to add more proof points.

- [ ] **Step 3:** Commit:

```bash
git add cv.md
git commit -m "feat: add CV — core profile document"
```

---

### Task 1.2: Create config/profile.yml

**Files:** Create `config/profile.yml` (copy from `config/profile.example.yml` and fill in).

- [ ] **Step 1:** Copy the example:

```bash
cp config/profile.example.yml config/profile.yml
```

- [ ] **Step 2:** Open `config/profile.yml` and replace all placeholder values with this structure (Claude Code writes this, Devang fills in the bracketed values):

```yaml
# career-ops-devang: Personal Profile
# Last updated: [today's date]

personal:
  name: "Devang [Last Name]"
  location: "Bengaluru, India"
  notice_period: "90 days"  # Standard PhonePe notice — adjust if different
  open_to_relocation: false
  open_to_remote: true
  citizenship: "Indian"

current_role:
  company: "PhonePe"
  title: "Senior Product Manager"
  domain: "UPI / Payments"
  tenure_years: [X]  # Replace with actual years
  reason_for_looking: "passive"  # passive | active | urgent

search_mode: "passive"
# passive = evaluating selectively, currently employed, high bar for applying
# active = currently job hunting, lower bar, speed matters

target_roles:
  primary:
    - "Senior Product Manager"
    - "Group Product Manager"
    - "Director of Product"
  secondary:
    - "Product Lead"
    - "Head of Product"

target_tracks:
  - "ai-pm"        # AI-native product roles
  - "fintech-pm"   # Fintech / payments PM roles

target_companies:
  tier_1:  # Dream companies — apply to anything relevant
    - "Anthropic"
    - "OpenAI"
    - "Razorpay"
    - "CRED"
    - "Juspay"
    - "Setu"
  tier_2:  # Strong interest — apply if good fit score
    - "Groww"
    - "Zepto"
    - "Jupiter"
    - "Fi"
    - "Sarvam AI"
    - "Yellow.ai"
    - "Retool"
    - "Stripe"
  tier_3:  # Open — apply if score >= 4.0
    - "Slice"
    - "BharatPe"
    - "Meesho"
    - "Swiggy"
    - "Zomato"

compensation:
  current_ctc_lpa: [X]       # Your current CTC in LPA — required for comp delta calc
  target_ctc_min_lpa: [X]    # Minimum acceptable
  target_ctc_ideal_lpa: [X]  # Ideal target
  esop_weight: "high"        # how much you value equity: low | medium | high
  currency_preference: "INR" # INR | USD | open

dealbreakers:
  - "Bond clause > 1 year"
  - "100% on-site in non-Bengaluru city"
  - "IC-only track with no path to management"
  - "No AI/tech component to the product"

green_flags:
  - "Payments / fintech domain"
  - "AI-native product"
  - "Series B or later with clear liquidity path"
  - "Remote-friendly or Bengaluru-based"
  - "Multi-product company with promotion track"
  - "Published engineering blog / strong technical culture"

passive_search_threshold: 4.5
# For passive search: only seriously consider roles scoring >= 4.5/5
# Below this, the system will note the role but not recommend action

active_search_threshold: 3.8
# If you switch to active mode, lower threshold kicks in

cv_tracks:
  ai_pm:
    lead_with:
      - "AI product work (Gemini, Claude implementations)"
      - "Product Brain / internal AI tooling"
      - "AI PM upskilling plan and hands-on ML fluency"
    de_emphasise:
      - "Operational metrics without AI component"
  fintech_pm:
    lead_with:
      - "UPI scale and payment infrastructure depth"
      - "Cross-functional fintech experience (compliance, risk, ops)"
      - "NPCI ecosystem and regulatory fluency"
    de_emphasise:
      - "AI work (unless role explicitly asks for it)"
```

**⚠️ [DEVANG DOES THIS]:** Fill in all bracketed values (CTC, tenure, etc.). The `dealbreakers` and `green_flags` sections especially — be honest. The scoring model uses these.

- [ ] **Step 3:** Commit:

```bash
git add config/profile.yml
git commit -m "feat: add personal profile config"
```

---

### ✅ Phase 1 Checkpoint

```bash
ls -la cv.md config/profile.yml
```

**Expected:** Both files exist and are non-empty. If either is missing or still contains placeholder brackets, do not proceed. Ask Devang to complete them.

---

## PHASE 2: New Archetype Mode Files

> **CTO Note:** These files are the intelligence layer. They define how the system interprets a JD for each archetype. Do not rush this phase. The prompt content is as important as the infrastructure.

### Task 2.1: Create modes/fintech-pm.md

**Files:** Create `modes/fintech-pm.md`

- [ ] **Step 1:** Create the file with this exact content:

```markdown
# Mode: fintech-pm
# Archetype: Senior Fintech PM
# Trigger: Roles at payment companies, BFSI, fintech startups, GCCs for financial institutions

## Archetype Identity

You are evaluating a Senior Fintech PM role for a candidate with deep payments/UPI experience from PhonePe. The evaluation must be calibrated for India's fintech market, not generic Western PM criteria.

This archetype activates for roles at:
- Payment infrastructure companies (Razorpay, Juspay, PayU, Cashfree, Pine Labs)
- Consumer fintech (CRED, Slice, Jupiter, Fi, Niyo, BharatPe)
- Lending/credit products (KreditBee, MoneyTap, Lendingkart, Perfios, Signzy)
- GCCs with fintech mandates (HSBC Tech, Deutsche Bank Tech, JP Morgan India, Goldman Sachs India)
- BFSI enterprise (Mswipe, M2P, Zeta, Setu, Khatabook)
- Embedded finance / API infrastructure companies

## Evaluation Blocks (Fintech PM)

### Block 1: Role-Candidate Match (Weight: 25%)
Score this block on how well the role matches the candidate's fintech domain depth.

**Strong match signals (+score):**
- Payments infrastructure ownership (not just "payments feature" on a non-payments product)
- Explicit UPI / NPCI ecosystem requirement or strong preference
- Cross-functional ownership across engineering, risk, compliance, ops
- B2C fintech OR B2B2C payment rails — candidate has both
- "0-to-1" or "platform" language in the JD

**Weak match signals (-score):**
- Role is primarily lending/credit without payment infrastructure component (domain gap)
- Enterprise BFSI with heavy waterfall/regulatory cycle (pace mismatch)
- Role is IC-only with no mention of team building or cross-functional influence
- Geographic mismatch with no remote option

### Block 2: Level and Seniority Alignment (Weight: 15%)
The candidate is a Senior PM with [X] years experience at India's largest UPI platform. 

**Evaluate:**
- Is the role actually senior enough? (too junior = no growth, overshoots are fine)
- Is there a path to GPM or Director? (important for passive search)
- Will candidate be building new capability or inheriting mature product?
- Team size signal: 0-person team vs established team matters

### Block 3: Compensation Analysis (Weight: 20%)

Pull profile.yml for current CTC and target bands. Compute:
- Estimated CTC range for this role (use GCC/fintech/startup stage benchmarks)
- Delta vs current: positive delta %, neutral, or regression
- Equity component: check if stock options mentioned, estimate value if stage is known
- Bond clause risk: flag any mention of bond/lock-in period

For GCCs: note that total comp often trails VC-backed startups but stability and work-life balance are higher.

Format output as:
```
Comp Estimate: ₹[X]–[Y]L CTC
vs Current: [+X% / -X% / unclear]
Equity: [mentioned/not mentioned/estimated at ₹Xk-Yk]
Bond risk: [none/low/high — quote the clause if present]
```

### Block 4: Company and Stage Intelligence (Weight: 20%)

Research the company before scoring. For Indian fintech companies, check:
- Funding stage and last round date (Series A/B/C/D/pre-IPO/public)
- Burn rate signals (hiring freeze news, recent layoffs, revenue disclosure)
- NPCI/RBI licensing status if relevant (PA licence, PPI licence, etc.)
- Glassdoor signal for fintech-specific complaints (compliance pressure, tech debt, firefighting culture)
- GLS (Ghost Likelihood Score) from India fork: flag if score > 50

**India-specific GCC check:**
If this is a GCC role, flag: "GCC note — assess whether role has product ownership (good) or feature delivery for HQ (limited growth ceiling)."

### Block 5: Personalisation and Fit Narrative (Weight: 10%)

Write 3–5 bullet points that frame why the candidate is compelling for this specific role. These should:
- Reference a specific product or team at the company by name
- Connect candidate's PhonePe-scale experience to a concrete challenge the company faces
- Be honest about gaps (don't paper over them)
- Suggest one "opening question to ask in the interview" that signals domain depth

### Block 6: Interview Prep and STAR Bank (Weight: 10%)

Surface 2–3 STAR stories from cv.md that are most relevant to this role. For each:
- Map to a likely interview question at this type of company
- Note which metric/proof point to lead with
- Flag if the story needs a "fintech-specific reframe" (e.g., a payments story that should emphasise regulatory complexity, not just scale)

**Standard fintech PM interview questions to prepare for:**
- "Tell me about a time you shipped a product under regulatory constraint."
- "How do you prioritise between reducing payment failure rate vs adding new payment methods?"
- "Describe your experience working with compliance and risk teams."
- "How do you think about trust and safety in a payments product?"

## Passive Search Modifier

If profile.yml shows `search_mode: passive`, apply this modifier:

Before outputting the recommendation, ask: **"Would this role be worth leaving PhonePe for?"**

Score on 4 dimensions:
1. **Strategic uplift** (0–2): Does this role give the candidate something PhonePe cannot? (scope, company stage, domain expansion, title/level jump)
2. **Comp delta** (0–2): Is total comp materially better? (>20% delta = 2, 10–20% = 1, <10% = 0)
3. **Growth ceiling** (0–1): Is there a clear path to GPM/Director/VP within 2–3 years?
4. **Regret test** (0–1): Would the candidate regret not applying in 2 years?

Passive search threshold: only recommend "apply" if passive score >= profile.yml `passive_search_threshold`.

Output passive score as: `Passive Score: X/6 — [Recommend Apply / Hold / Pass]`
```

- [ ] **Step 2:** Verify the file was created:

```bash
wc -l modes/fintech-pm.md
```

**Expected:** 100+ lines.

- [ ] **Step 3:** Commit:

```bash
git add modes/fintech-pm.md
git commit -m "feat: add fintech-pm archetype mode"
```

---

### Task 2.2: Create modes/ai-pm-india.md

**Files:** Create `modes/ai-pm-india.md`

- [ ] **Step 1:** Create the file with this exact content:

```markdown
# Mode: ai-pm-india
# Archetype: Senior AI PM (India-aware)
# Trigger: AI-native product roles, LLM product roles, ML platform PM roles

## Archetype Identity

You are evaluating a Senior AI PM role for a candidate at PhonePe who is actively upskilling in AI product (14-week structured plan, Claude Code fluency, Gemini API implementation, hands-on LLM evals). Evaluate as a strong AI PM candidate who is NOT a career AI PM but is a strong fintech PM with genuine, demonstrated AI fluency.

This archetype activates for roles at:
- Global AI labs with India presence (Anthropic, OpenAI, Google DeepMind, Mistral, Cohere)
- Indian AI-native startups (Sarvam AI, Krutrim, Yellow.ai, Gnani.ai, Observe.AI India)
- AI platform companies (Weights & Biases, Arize AI, Langfuse, Retool with AI features)
- Fintech + AI intersection (companies explicitly hiring for AI features on fintech products)
- LLMOps / AI infrastructure (companies building model serving, evals, RAG infrastructure)
- Agentic payments and AI-powered fraud/risk (strategic fit with PhonePe background)

## Evaluation Blocks (AI PM)

### Block 1: Role-Candidate Match (Weight: 25%)

**Strong match signals (+score):**
- Role involves defining AI product strategy, not just writing PRDs for AI features
- LLM integration experience is explicitly valued (not required to have trained models)
- "Evals", "model quality", "hallucination mitigation", "RLHF", "RAG" mentioned
- Cross-functional with ML engineering (not pure PM managing a roadmap)
- Agentic AI, multi-modal, or payments-adjacent AI use case (leverages candidate's domain)

**Weak match signals (-score):**
- Role requires PhD or "5+ years AI product" (candidate is transitioning, not career AI PM)
- Pure ML research team PM (too technical, not the right domain)
- Role is "AI feature PM" at a non-AI company with no strategic AI mandate (low ceiling)
- Requires hands-on Python/model training (role confusion — this is engineering, not PM)

**Honest gap assessment:**
The candidate has 0 years as a "dedicated AI PM" and is actively building fluency. Do not overstate fit. Flag clearly: "Gap: No prior AI PM title. Mitigant: Demonstrated AI product work (Gemini Flash implementation, Claude Code, Product Brain tool). Evaluation: this is a strong bet hire, not a sure hire."

### Block 2: Level and Seniority Alignment (Weight: 15%)

AI PM roles are often titled differently from traditional PM roles. Map:
- "AI Product Lead" / "AI PM" → treat as Senior PM level
- "Head of AI Product" → treat as Director level (may be a stretch)
- "AI Product Manager" (no Senior) → check scope — may be mid-level even if AI-focused

Flag: "If the role is below Senior equivalent, applying may limit negotiating leverage given candidate's current level at PhonePe."

### Block 3: Compensation Analysis (Weight: 20%)

AI PM roles have a wide comp range. Segment:
- Global AI labs (Anthropic, OpenAI India): likely USD-denominated or USD-parity INR. High ESOP value.
- Indian AI startups (Sarvam, Krutrim): Series A/B stage — lower base, higher equity, higher risk
- Fintech+AI (Razorpay AI, Juspay AI): similar to fintech PM band + AI premium
- GCCs with AI mandate: stable, below startup, good for risk-averse transition

For equity in early-stage Indian AI startups: note that liquidity is 5–8 year horizon. Flag if the base alone doesn't meet profile.yml `target_ctc_min_lpa`.

### Block 4: Company and Stage Intelligence (Weight: 20%)

For AI companies, additional research dimensions:
- Foundation model vs application layer vs tooling (affects candidate leverage)
- India office: headcount, whether product decisions happen here or HQ
- Safety posture: for labs like Anthropic — is there responsible AI / policy work that would suit a thoughtful PM?
- Revenue model: API-first, B2B SaaS, consumer — maps to candidate's skills differently
- DPDP Act / AI regulation readiness: India-specific angle, especially if AI touches financial data

**India AI ecosystem context:**
Sarvam AI, Krutrim, and similar: building foundation models for Indian languages. Strong mission fit for an India-based PM. But early stage — expect high ambiguity, resource constraints. Score stage fit honestly.

### Block 5: Personalisation and Fit Narrative (Weight: 10%)

The "AI PM transitioning from fintech" narrative is actually strong — frame it:
1. You've shipped at UPI scale, which means you understand reliability, latency, and trust at a level most AI PMs haven't operated at
2. Agentic payments / AI-powered fraud is a genuine intersection of the two domains
3. Your PhonePe context gives you a real user problem to bring into AI product work — not abstract ML

Write 3 personalisation bullets that use this frame. Avoid "passionate about AI" language — it's filler.

### Block 6: Interview Prep (Weight: 10%)

STAR stories to surface from cv.md that are most relevant:
- Any story involving user trust, safety, or failure mode analysis → maps to AI safety/reliability questions
- Any story involving data-driven product decisions → maps to evals/metrics questions
- Any story involving cross-functional alignment under uncertainty → maps to "how do you work with ML engineers" questions

**Standard AI PM interview questions:**
- "How do you measure the quality of an AI feature?"
- "Tell me about a time you shipped something where the model was wrong. How did you handle it?"
- "How do you prioritise between model improvement work and new feature development?"
- "How do you explain AI limitations to stakeholders?"
- "What's your view on the right PM/ML engineer ratio on an AI team?"

## Passive Search Modifier

Same passive scoring framework as fintech-pm.md, with one addition:

**AI-specific question:** Does this role give the candidate AI PM *title* history? For a transitioning PM, a role with "AI Product Manager" in the title is worth more strategically than a slightly higher-comp role with "Senior PM" at an AI company. Flag this in the recommendation.

Output passive score as: `Passive Score: X/6 — [Recommend Apply / Hold / Pass]`

## Dual-Track CV Note

When this archetype triggers AND the candidate has `cv_tracks.ai_pm` defined in profile.yml:
- Generate CV with AI track framing (lead with Gemini, Claude Code, Product Brain)
- De-emphasise pure operational fintech metrics unless they support an AI story
- Add a "Current AI Work" section near the top if it doesn't already exist in cv.md
```

- [ ] **Step 2:** Verify:

```bash
wc -l modes/ai-pm-india.md
```

**Expected:** 100+ lines.

- [ ] **Step 3:** Commit:

```bash
git add modes/ai-pm-india.md
git commit -m "feat: add ai-pm-india archetype mode"
```

---

### Task 2.3: Create modes/intake.md

**Files:** Create `modes/intake.md`

- [ ] **Step 1:** Create the file:

```markdown
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

1. "Walk me through the Gemini Flash implementation at PhonePe. What problem, what model, what outcome?"
2. "Tell me about Product Brain. What does it do, who uses it, what's the measurable impact?"
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
```

- [ ] **Step 2:** Commit:

```bash
git add modes/intake.md
git commit -m "feat: add intake mode with accomplishment mining and anti-slop gate"
```

---

### ✅ Phase 2 Checkpoint

```bash
ls modes/fintech-pm.md modes/ai-pm-india.md modes/intake.md
```

**Expected:** All three files exist.

---

## PHASE 3: Update Existing Modes

### Task 3.1: Update modes/oferta.md — Archetype Detection

**Files:** Modify `modes/oferta.md`

- [ ] **Step 1:** Read the current archetype detection block in `modes/oferta.md`. It will contain a section that lists existing archetypes (LLMOps, Agentic, PM, SA, FDE, Transformation, and India-specific ones from the fork). Find it.

- [ ] **Step 2:** Add the following two entries to the archetype detection list. Find the existing archetype entries and insert after the `pm` archetype entry:

```markdown
**fintech-pm:** Activate when the JD contains 2+ of: payment gateway, UPI, NACH, IMPS, NPCI, payment infrastructure, PCI-DSS, RBI compliance, fintech, lending, credit product, BFSI, banking technology. OR when the hiring company is a known Indian fintech (Razorpay, Juspay, Cashfree, CRED, Slice, Jupiter, Fi, BharatPe, Setu, Zeta, M2P, PayU, Pine Labs, Mswipe, Paytm, PhonePe, Groww, Zerodha, Jar). Load `modes/fintech-pm.md` for evaluation.

**ai-pm-india:** Activate when the JD contains 2+ of: LLM, language model, generative AI, AI product, ML platform, model evaluation, evals, RAG, agentic, Claude, GPT, Gemini, foundation model. OR when the hiring company is a known AI-native company (Anthropic, OpenAI, Sarvam AI, Krutrim, Yellow.ai, Gnani.ai, Observe.AI, Arize AI, Weights & Biases, Langfuse, Cohere, Mistral). Load `modes/ai-pm-india.md` for evaluation.

**Dual-track detection:** If a JD would trigger BOTH `fintech-pm` AND `ai-pm-india`, activate `ai-pm-india` as primary but load `fintech-pm.md` for supplementary comp and company intelligence. Note in the report: "Dual-track role — CV framing: AI track (see profile.yml cv_tracks.ai_pm)."
```

- [ ] **Step 3:** Verify the file is syntactically intact (no broken markdown):

```bash
head -50 modes/oferta.md
```

**Expected:** First 50 lines render without obvious formatting breaks.

- [ ] **Step 4:** Commit:

```bash
git add modes/oferta.md
git commit -m "feat: extend archetype detection for fintech-pm and ai-pm-india"
```

---

### Task 3.2: Update modes/_shared.md — Passive Search Context and Quality Gate

**Files:** Modify `modes/_shared.md`

- [ ] **Step 1:** Read `modes/_shared.md` to understand its current structure. It will contain global context that all modes inherit.

- [ ] **Step 2:** At the END of the file (after all existing content), append this block:

```markdown

---

## Passive Search Protocol

The user is currently employed at PhonePe as a Senior PM. `search_mode: passive` is set in profile.yml.

**What this means for every evaluation:**
- The bar for recommending "apply" is higher than for an active job seeker
- Always compute the passive score (see fintech-pm.md and ai-pm-india.md for the scoring rubric)
- Always ask: "Is this worth leaving a senior role at India's largest payments platform?"
- Never suggest applying to a role that doesn't clear `passive_search_threshold` from profile.yml
- If a role is interesting but below threshold, output: "Monitor — revisit if situation changes"

## Dual-Track CV Awareness

This user has two CV framings defined in profile.yml:
- **ai_pm track:** Lead with AI product work, Gemini/Claude implementations, Product Brain
- **fintech_pm track:** Lead with UPI scale, payment infrastructure, cross-functional fintech depth

When generating a tailored CV or PDF:
1. Read the archetype that triggered
2. Load the corresponding `cv_tracks` section from profile.yml
3. Reorder cv.md bullets accordingly — don't fabricate, reorder and reframe
4. The first bullet under each role should be the most relevant achievement for this track

## Global Quality Gate (Anti-Slop)

Before outputting any career document (CV, cover letter, STAR story, outreach message):
- Check for banned phrases (see modes/intake.md for the full list)
- If found: rewrite that sentence before delivering
- Documents below quality threshold are never shown to the user — rewrite first

This is a non-negotiable quality standard. It protects the user's professional reputation.

## Profile Reference

Key facts loaded from config/profile.yml and cv.md at evaluation time:
- Current company: PhonePe
- Domain expertise: UPI, payment infrastructure, NPCI ecosystem
- AI fluency: Claude Code, Gemini API, LLM product work (active upskilling)
- Location: Bengaluru (remote-friendly, not open to relocation)
- Search posture: Passive — high bar, selective applications only
```

- [ ] **Step 3:** Commit:

```bash
git add modes/_shared.md
git commit -m "feat: add passive search protocol, dual-track CV awareness, quality gate to shared context"
```

---

### Task 3.3: Update modes/batch.md — Register New Archetypes

**Files:** Modify `modes/batch.md`

- [ ] **Step 1:** Open `modes/batch.md`. Find the section where archetypes are listed for the batch processor (it will likely be an array or list of supported archetypes).

- [ ] **Step 2:** Add `fintech-pm` and `ai-pm-india` to the archetype list, following the exact format of existing entries.

- [ ] **Step 3:** Commit:

```bash
git add modes/batch.md
git commit -m "feat: register fintech-pm and ai-pm-india in batch processor"
```

---

### ✅ Phase 3 Checkpoint

```bash
grep -l "fintech-pm" modes/oferta.md modes/batch.md
grep -l "passive_search_threshold" modes/_shared.md
```

**Expected:** Both commands return the file names (confirming the strings are present).

---

## PHASE 4: Portal Configuration

### Task 4.1: Create portals.yml with Indian Unicorn + Global AI Company Set

**Files:** Create `portals.yml` in project root (copy from templates/portals.example.yml and replace).

- [ ] **Step 1:** Copy the template:

```bash
cp templates/portals.example.yml portals.yml
```

- [ ] **Step 2:** At the END of `portals.yml`, append this section (do not delete the existing portals — add below them):

```yaml

# ============================================================
# DEVANG CUSTOM: Senior PM Portal Set
# Indian Fintech + AI companies + Global AI labs
# Last updated: [today's date]
# ============================================================

companies:

  # --- Indian Fintech: Tier 1 ---

  - name: "Razorpay"
    url: "https://razorpay.com/jobs"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "razorpay" "Product Manager" OR "Product Lead"'
    notes: "Bengaluru HQ. Full-stack payments (PG, POS, banking). Actively hiring PMs."

  - name: "Juspay"
    url: "https://juspay.in/careers"
    ats: "direct"
    scan_query: '"juspay" "Product Manager" site:linkedin.com/jobs'
    notes: "Bengaluru. Deep payments infra, UPI orchestration. High technical bar. Strong fit."

  - name: "CRED"
    url: "https://careers.cred.club"
    ats: "freshteam"
    scan_query: '"cred" "Product Manager" OR "Product Lead" site:linkedin.com/jobs Bengaluru'
    notes: "Bengaluru. High-design product culture. Look for PM roles in payments or growth."

  - name: "Setu"
    url: "https://setu.co/careers"
    ats: "direct"
    scan_query: '"setu" "fintech" "Product" site:linkedin.com/jobs'
    notes: "API infrastructure for fintech. Pine Labs acquisition. Excellent for fintech-pm archetype."

  - name: "Zeta"
    url: "https://zeta.tech/careers"
    ats: "direct"
    scan_query: '"zeta tech" "Product Manager" site:linkedin.com/jobs'
    notes: "Core banking + payments SaaS. B2B. Bhavin Turakhia company. Strong engineering culture."

  # --- Indian Fintech: Tier 2 ---

  - name: "Groww"
    url: "https://groww.in/careers"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "groww" "Product"'
    notes: "Bengaluru. Investments + payments product. Strong data culture."

  - name: "Zepto"
    url: "https://www.zeptonow.com/careers"
    ats: "direct"
    scan_query: '"zepto" "Product Manager" site:linkedin.com/jobs'
    notes: "Q-commerce. Payments and checkout PM roles interesting. Fast-paced startup."

  - name: "Jupiter"
    url: "https://jupiter.money/careers"
    ats: "direct"
    scan_query: '"jupiter money" "Product" site:linkedin.com/jobs'
    notes: "Neo-bank. Strong product culture. Bengaluru. Relevance for fintech-pm."

  - name: "Fi"
    url: "https://fi.money/careers"
    ats: "direct"
    scan_query: '"fi money" OR "epifi" "Product Manager" site:linkedin.com/jobs'
    notes: "Neo-bank (Google-backed). Bengaluru. Payments + wealth management PM roles."

  - name: "BharatPe"
    url: "https://bharatpe.com/careers"
    ats: "direct"
    scan_query: '"bharatpe" "Senior Product Manager" site:linkedin.com/jobs'
    notes: "SME payments + lending. Delhi HQ but remote roles exist. Check for remote."

  - name: "M2P Fintech"
    url: "https://m2pfintech.com/careers"
    ats: "direct"
    scan_query: '"m2p fintech" "Product" site:linkedin.com/jobs'
    notes: "Card-as-a-service, API banking infra. Chennai HQ. Niche but strong fintech-pm fit."

  - name: "Perfios"
    url: "https://perfios.com/careers"
    ats: "direct"
    scan_query: '"perfios" "Product Manager" site:linkedin.com/jobs'
    notes: "Financial data infrastructure. B2B. Strong if interested in fintech data products."

  # --- Indian AI-Native ---

  - name: "Sarvam AI"
    url: "https://www.sarvam.ai/careers"
    ats: "direct"
    scan_query: '"sarvam" "Product" site:linkedin.com/jobs'
    notes: "Indian-language foundation models. Series A. High mission, early stage. ai-pm-india archetype."

  - name: "Krutrim"
    url: "https://krutrim.ai/careers"
    ats: "direct"
    scan_query: '"krutrim" "Product" site:linkedin.com/jobs'
    notes: "Ola's AI lab. Indian LLM. Early. High ambiguity — check role scope carefully."

  - name: "Yellow.ai"
    url: "https://yellow.ai/careers"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "yellow.ai" "Product"'
    notes: "Conversational AI for enterprises. Bengaluru. ai-pm-india archetype. Strong Series C."

  - name: "Gnani.ai"
    url: "https://gnani.ai/careers"
    ats: "direct"
    scan_query: '"gnani" "Product Manager" site:linkedin.com/jobs'
    notes: "Voice AI for Indian languages. Bengaluru. Niche but strong India AI fit."

  # --- Global AI Labs ---

  - name: "Anthropic"
    url: "https://www.anthropic.com/careers"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "anthropic" "Product Manager" OR "Product Lead" remote'
    notes: "Safety-focused AI lab. Remote-friendly. ai-pm-india archetype. Dream company tier."

  - name: "OpenAI"
    url: "https://openai.com/careers"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "openai" "Product Manager" remote'
    notes: "AI applications + API products. Remote some roles. ai-pm-india archetype."

  # --- GCC / Enterprise AI ---

  - name: "Google India (DeepMind / GCP AI)"
    url: "https://careers.google.com"
    ats: "direct"
    scan_query: 'site:careers.google.com "Product Manager" "AI" OR "Payments" Bengaluru'
    notes: "Google Pay India + DeepMind India. Check for PM roles in payments or AI products."

  - name: "Stripe India"
    url: "https://stripe.com/jobs"
    ats: "greenhouse"
    scan_query: 'site:job-boards.greenhouse.io "stripe" "Product Manager" remote OR India'
    notes: "Payments infrastructure. Remote/India roles exist. High bar, strong ai-pm + fintech-pm fit."

# ============================================================
# Search Queries (Senior PM Specific)
# ============================================================

search_queries:
  - name: "Senior AI PM — India remote"
    query: 'site:jobs.ashbyhq.com OR site:job-boards.greenhouse.io "Senior Product Manager" "AI" OR "LLM" remote India 2024 2025'

  - name: "Fintech PM — Bengaluru"
    query: 'site:linkedin.com/jobs "Senior Product Manager" "payments" OR "fintech" OR "UPI" Bengaluru'

  - name: "Head of Product — Indian fintech"
    query: '"Head of Product" OR "Group Product Manager" fintech payments India site:linkedin.com/jobs'

  - name: "AI PM — India unicorns"
    query: '"Product Manager" "AI" OR "ML" "Bengaluru" OR "remote" site:jobs.ashbyhq.com OR site:job-boards.greenhouse.io'

  - name: "iimjobs Senior PM"
    query: 'site:iimjobs.com "Senior Product Manager" "payments" OR "fintech" OR "AI"'

  - name: "Cutshort Senior PM"
    query: 'site:cutshort.io "Senior Product Manager" "fintech" OR "AI" Bengaluru'
```

- [ ] **Step 3:** Verify portal count:

```bash
grep -c "name:" portals.yml
```

**Expected:** The count should be the original portals plus the ~20 new ones added above.

- [ ] **Step 4:** Commit:

```bash
git add portals.yml
git commit -m "feat: add Indian fintech + AI company portal config for Senior PM"
```

---

### ✅ Phase 4 Checkpoint

```bash
grep "Razorpay\|Sarvam\|Anthropic\|passive_search_threshold" portals.yml modes/_shared.md
```

**Expected:** Output shows matches in both files.

---

## PHASE 5: Changelog and Documentation

### Task 5.1: Create DEVANG_CHANGES.md

**Files:** Create `DEVANG_CHANGES.md` in project root.

- [ ] **Step 1:** Create the file:

```markdown
# DEVANG_CHANGES.md
# Diff log: what changed from career-ops-india upstream and why
# Purpose: makes it easy to rebase off upstream without losing customisations

## Base Fork
`itsmedhawal/career-ops-india` — commit [FILL IN COMMIT HASH OF FORK POINT]

## Files Added (New, not in upstream)
| File | Purpose | Can upstream conflict? |
|---|---|---|
| `cv.md` | Personal CV | No — user file |
| `config/profile.yml` | Personal profile | No — user file |
| `portals.yml` | Custom portal list | Possible — merge carefully |
| `modes/fintech-pm.md` | Fintech PM archetype | No — new file |
| `modes/ai-pm-india.md` | AI PM India archetype | No — new file |
| `modes/intake.md` | Accomplishment mining | No — new file |

## Files Modified (Diverge from upstream)
| File | Change summary | Rebase risk |
|---|---|---|
| `modes/oferta.md` | Added fintech-pm and ai-pm-india to archetype detection block | Low — additive only |
| `modes/_shared.md` | Appended passive search protocol, dual-track context, quality gate | Low — appended to end |
| `modes/batch.md` | Added new archetypes to archetype list | Low — additive |

## Files Never Touched (Safe to pull upstream)
All infrastructure scripts: scan.mjs, generate-pdf.mjs, doctor.mjs, dedup-tracker.mjs, etc.
All dashboard Go files.
package.json, flake.nix.

## How to Pull Upstream Updates Safely
```bash
git remote add upstream https://github.com/itsmedhawal/career-ops-india.git
git fetch upstream
# Review diff before merging — pay attention to modes/_shared.md and modes/oferta.md
git diff upstream/main -- modes/_shared.md modes/oferta.md modes/batch.md
# If clean: 
git merge upstream/main
```

## Customisation Intent
Built for: Senior PM at PhonePe (UPI/fintech domain) evaluating both AI PM and Fintech PM roles
Search mode: Passive (employed, selective)
Key additions: fintech-pm archetype, ai-pm-india archetype, passive search scoring, Indian unicorn portals
```

- [ ] **Step 2:** Fill in the actual upstream commit hash:

```bash
git log --oneline -1 origin/main
```

Copy the hash into the `DEVANG_CHANGES.md` base fork line.

- [ ] **Step 3:** Commit everything:

```bash
git add DEVANG_CHANGES.md
git commit -m "docs: add upstream diff log for safe rebasing"
git push origin main
```

---

## PHASE 6: End-to-End Test

> **CTO Note:** Do not skip this phase. A system that was never tested is a system that probably doesn't work.

### Task 6.1: Run the Doctor Check

- [ ] **Step 1:**

```bash
npm run doctor
```

**Expected:** All checks pass. If any fail, fix them before proceeding.

---

### Task 6.2: Test with a Real JD — Fintech Track

**⚠️ [DEVANG DOES THIS]:** Find one real job posting from any Indian fintech company (Razorpay, CRED, Juspay, etc.) and paste the URL or JD text.

- [ ] **Step 1:** In Claude Code:

```
/career-ops [paste the JD URL or text here]
```

**Expected output structure:**
- Archetype detected: `fintech-pm`
- 6 evaluation blocks completed
- Passive score computed (X/6)
- Recommendation: Apply / Monitor / Pass
- CV framing note: "Use fintech_pm track"

If archetype detected is wrong (e.g., shows generic `pm` instead of `fintech-pm`), check `modes/oferta.md` — the detection block may not have been saved correctly.

---

### Task 6.3: Test with a Real JD — AI PM Track

**⚠️ [DEVANG DOES THIS]:** Find one real AI PM job posting (Sarvam AI, Yellow.ai, or a global AI lab).

- [ ] **Step 1:**

```
/career-ops [paste the AI PM JD URL or text here]
```

**Expected output structure:**
- Archetype detected: `ai-pm-india`
- Honest gap assessment included (candidate is transitioning, not career AI PM)
- Passive score computed
- CV framing note: "Use ai_pm track"

---

### Task 6.4: Test the Intake Mode

- [ ] **Step 1:**

```
/career-ops intake
```

**Expected:** Claude begins the structured interview session from `modes/intake.md`. It asks for specific metrics, pushes back on generic answers, and at the end produces updated bullet points for `cv.md`.

---

### ✅ Phase 6 Checkpoint — Full System Verification

```bash
git log --oneline -10
```

**Expected:** Should show 10+ clean commits, one per feature added. If you see "initial commit" and nothing else, something went wrong.

```bash
ls modes/fintech-pm.md modes/ai-pm-india.md modes/intake.md cv.md config/profile.yml portals.yml DEVANG_CHANGES.md
```

**Expected:** All 7 files exist.

---

## MAINTENANCE PROTOCOL

### Keeping in Sync with Upstream (Monthly)

```bash
git fetch upstream
git log upstream/main --oneline -5
# Review what changed
git diff upstream/main -- modes/_shared.md modes/oferta.md
# If no conflicts in those files:
git merge upstream/main
```

### When Starting a Job Search (Switching from Passive to Active)

1. Update `config/profile.yml`: change `search_mode: passive` → `search_mode: active`
2. Update `passive_search_threshold` to `3.8` (or your preferred active threshold)
3. Run `/career-ops intake` to refresh your proof points before applying

### When cv.md Gets Stale

Run `/career-ops intake` — this surfaces new accomplishments and updates the file.

### Adding More Companies to portals.yml

Tell Claude Code: *"Add [company name] to portals.yml. It uses [Greenhouse/Ashby/Lever/direct]. I'm looking for Senior PM roles there."* Claude Code will find the correct ATS URL and add the entry in the right format.

---

## RISK REGISTER

| Risk | Likelihood | Mitigation |
|---|---|---|
| Archetype misdetection (JD triggers wrong archetype) | Medium | Manual override: start prompt with "Evaluate as fintech-pm:" |
| cv.md too thin → weak evaluations | High | Run `/career-ops intake` session before first real evaluation |
| Passive score threshold too high → misses good roles | Low | Adjust `passive_search_threshold` in profile.yml |
| Upstream career-ops-india goes stale | Medium | DEVANG_CHANGES.md documents all diffs; safe to rebase |
| Portal scan returns ghost jobs | Low | GLS from India fork already handles this |
| API costs if batch-scanning many companies | Medium | Don't batch scan > 20 companies at once; use `--min-score 4.0` flag |

---

*Plan version: 1.0 | Built for Devang | Based on career-ops-india by itsmedhawal + quality gate patterns from poferraz/career-ops*
