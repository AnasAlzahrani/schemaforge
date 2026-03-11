# Reddit Post — r/SEO

## Title
Free schema markup generator — built it after Google and SchemaApp both killed theirs

## Body

Hey everyone,

Not sure if anyone else ran into this recently, but the free schema generator tools have been quietly disappearing. Google deprecated their Structured Data Markup Helper a while back, and SchemaApp recently killed their free tier — you now need to pay or sign up for a trial just to generate basic JSON-LD.

I was tired of hand-writing schema or relying on janky WordPress plugins that bloat page speed, so I built a free tool: **ProtoCol** — [https://schemaforge-seven.vercel.app](https://schemaforge-seven.vercel.app)

It generates valid JSON-LD for 8 schema types:
- FAQ Page
- Local Business
- Article
- Product
- Event
- How-To
- Organization
- Recipe

**How it works:** pick a type, fill in the form, the JSON-LD generates in real-time as you type, click copy, paste it into your `<head>`. That's it.

No account, no signup, no email gate, no "free trial" nonsense. It runs entirely in your browser — there's no backend or server processing at all.

I built it mainly for my own workflow (I manage structured data across a bunch of sites), but figured it might be useful for other people in the same boat.

A few things I specifically focused on:
- **Output that actually passes Rich Results Test** — I tested every schema type against Google's validator
- **Mobile-friendly** — because I often do quick edits from my phone
- **No dependencies** — loads instantly, no framework overhead

Would love any feedback, especially if you notice edge cases where the generated schema doesn't validate. Happy to add more schema types too if there's demand.

---

*Mods: this is a free tool with no monetization, not a product launch. Happy to remove if this crosses any lines.*
