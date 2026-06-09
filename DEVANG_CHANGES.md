# DEVANG_CHANGES.md
# Diff log: what changed from career-ops-india upstream and why
# Purpose: makes it easy to rebase off upstream without losing customisations

## Base Fork
`itsmedhawal/career-ops-india` — commit 32e0252 (Add files via upload)

## Files Added (New, not in upstream)
| File | Purpose | Can upstream conflict? |
|---|---|---|
| `cv.md` | Personal CV | No — user file |
| `config/profile.yml` | Personal profile (gitignored — local only) | No — user file |
| `portals.yml` | Custom portal list (gitignored — local only) | Possible — merge carefully |
| `modes/fintech-pm.md` | Fintech PM archetype | No — new file |
| `modes/ai-pm-india.md` | AI PM India archetype | No — new file |
| `modes/intake.md` | Accomplishment mining | No — new file |

## Files Modified (Diverge from upstream)
| File | Change summary | Rebase risk |
|---|---|---|
| `modes/oferta.md` | Added fintech-pm and ai-pm-india detection to Paso 0; added framing entries to Blocks B and F | Low — additive only |
| `modes/_shared.md` | Added fintech-pm/ai-pm-india to archetype detection table; appended passive search protocol, dual-track CV awareness, quality gate, profile reference | Low — appended to end |
| `modes/batch.md` | Added Supported Archetypes section with all 8 archetypes | Low — additive |

## Files Never Touched (Safe to pull upstream)
All infrastructure scripts: scan.mjs, generate-pdf.mjs, doctor.mjs, dedup-tracker.mjs,
merge-tracker.mjs, normalize-statuses.mjs, followup-cadence.mjs, analyze-patterns.mjs,
verify-pipeline.mjs, liveness-core.mjs, check-liveness.mjs, cv-sync-check.mjs,
update-system.mjs, test-all.mjs, pipeline.js.
All dashboard files.
package.json, flake.nix, flake.lock.
templates/ (cv-template.html, portals.example.yml, states.yml).
batch/batch-runner.sh, batch/batch-prompt.md.

## How to Pull Upstream Updates Safely
```bash
git remote add upstream https://github.com/itsmedhawal/career-ops-india.git
git fetch upstream
# Review diff before merging — pay attention to modes/_shared.md and modes/oferta.md
git diff upstream/main -- modes/_shared.md modes/oferta.md modes/batch.md
# If no conflicts in those files:
git merge upstream/main
```

## Customisation Intent
Built for: Senior PM at PhonePe (UPI/fintech domain) evaluating both AI PM and Fintech PM roles
Search mode: Passive (employed, selective)
Key additions:
- fintech-pm archetype (modes/fintech-pm.md) — evaluates Indian fintech/payments PM roles
- ai-pm-india archetype (modes/ai-pm-india.md) — evaluates AI-native PM roles, India-aware
- intake mode (modes/intake.md) — accomplishment mining + anti-slop quality gate
- passive search scoring — all evaluations compute a 0–6 passive score before recommending action
- dual-track CV framing — ai_pm track vs fintech_pm track, loaded from config/profile.yml
- Indian unicorn portals — 12 new companies added to portals.yml (Juspay, Setu, Zeta, Jupiter, Fi, BharatPe, M2P, Perfios, Gnani.ai, Anthropic, OpenAI, Stripe India)
