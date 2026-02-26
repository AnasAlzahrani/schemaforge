# SchemaForge — The Study Design Architect

**"What study design answers your question?"**

An AI-powered tool that walks researchers through study design decisions. Not a template generator — a consultation that challenges assumptions, identifies threats to validity, and produces a methodologically defensible protocol.

## MVP Scope (v0.1)

A single-page web app where a researcher:
1. Describes their research question in plain language
2. Gets walked through a decision tree (observational vs experimental, cohort vs case-control, etc.)
3. Receives a structured study design report with:
   - Recommended design + justification
   - Key assumptions + threats to validity
   - Sample size considerations
   - Suggested analysis approach
   - Common pitfalls for their specific design

## Tech Stack
- **Frontend:** Single HTML file (like coef.health) — vanilla JS, dark theme
- **Backend:** Vercel serverless function calling Gemini/Claude API
- **No database needed for MVP** — stateless consultation

## Why This Works
- Anas's methodology expertise IS the product (embedded in prompts)
- Interactive > static (not another "how to choose a study design" flowchart)
- Free tier drives traffic → paid tier unlocks full reports + code generation
- B2C first (researchers), B2B later (journals, pharma)

## Revenue Model
- Free: Basic design recommendation
- $29/mo: Full reports, Stata/R code generation, protocol templates
- $99/mo: Unlimited + priority, institutional features
