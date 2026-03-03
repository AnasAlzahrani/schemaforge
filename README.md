# 🏗️ SchemaForge — AI Study Design Architect

> **Your next study fails if the design is weak. SchemaForge fixes that in 20 minutes.**

SchemaForge is an AI-powered study design consultation tool for clinical researchers, epidemiologists, and biostatisticians. It doesn't generate templates — it walks you through methodology decisions like a senior epidemiologist would.

🔗 **Try it free:** [schemaforge-seven.vercel.app](https://schemaforge-seven.vercel.app)

## What It Does

Paste your research aim. Get a defensible study design with:

- **Recommended design** + justification (RCT, cohort, case-control, quasi-experimental)
- **Causal structure** — exposure, outcome, confounders, estimand, DAG
- **Threats to validity** — selection bias, confounding, immortal time bias, misclassification
- **Power & sample size** considerations
- **Analysis approach** — matching, weighting, IV, difference-in-differences
- **Sensitivity analyses** — E-value, quantitative bias analysis
- **Top 3 reviewer criticisms** + preemptive rebuttals

## Why Not Just Use ChatGPT?

General-purpose LLMs give confident-sounding study design advice that's wrong ~80% of the time:

| Problem | ChatGPT | SchemaForge |
|---------|---------|-------------|
| Causal question → recommends cross-sectional | ✅ Common | ❌ Catches it |
| Skips power calculation entirely | ✅ Common | ❌ Always included |
| Ignores immortal time bias | ✅ Common | ❌ Flags it |
| No DAG, no causal model | ✅ Common | ❌ Generates DAG |
| Doesn't challenge assumptions | ✅ Always agrees | ❌ Pushes back |

SchemaForge encodes real epidemiologic methodology — not just "write me a protocol."

## Study Types Supported

- **Randomized Controlled Trials** (parallel, cluster, crossover, adaptive, factorial)
- **Cohort studies** (prospective, retrospective, claims/EHR-based)
- **Case-control studies** (matched, nested, case-crossover)
- **Cross-sectional studies** (analytic, descriptive)
- **Quasi-experimental designs** (interrupted time series, regression discontinuity, difference-in-differences)
- **Target trial emulation** (for observational data mimicking RCT design)

## Causal Inference Methods

- Propensity Score Matching (PSM)
- Inverse Probability Weighting (IPW)
- Instrumental Variables (IV)
- Regression Discontinuity
- Difference-in-Differences
- Synthetic Control Methods

## Free Resources

- 📋 **[27-Point Study Design Checklist](https://schemaforge-seven.vercel.app/checklist)** — catch fatal design flaws before peer review
- 🏗️ **[Live Consultation](https://schemaforge-seven.vercel.app/consult)** — paste your aim, get a defensible design

## Tech Stack

- Vanilla JS frontend (dark/light theme)
- Vercel serverless functions
- AI-powered methodology engine
- No account required for basic consultation

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Basic consultation |
| Researcher | $99/mo | Full reports, DAG builder, power analysis, PDF export |
| Lab/Team | $249/mo | Unlimited consultations, 5 seats, rebuttal generator |
| Institution | $499/mo | Custom, API access, priority support |

14-day free trial. No credit card required.

## Who Built This

Built by [Coefficients Health Analytics](https://coef.health) — a research methodology company founded by clinical researchers with 20+ years of experience in causal inference, biostatistics, and study design.

## License

Proprietary. See [schemaforge-seven.vercel.app](https://schemaforge-seven.vercel.app) for terms.
