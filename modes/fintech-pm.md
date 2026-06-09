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
The candidate is a Senior PM with 6 years experience at India's largest UPI platform.

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
