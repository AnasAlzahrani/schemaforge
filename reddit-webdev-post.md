# Reddit Post — r/webdev (Weekly Showcase Thread)

## Title
SchemaForge — a zero-dependency schema markup generator (pure HTML/CSS/JS, no build step)

## Body

**What I built:** A free JSON-LD structured data generator that covers 8 schema types (FAQ, Local Business, Product, Article, Event, How-To, Organization, Recipe).

**Link:** [https://schemaforge-seven.vercel.app](https://schemaforge-seven.vercel.app)

**Tech stack (or lack thereof):**
- Pure HTML, CSS, vanilla JavaScript
- Zero npm packages
- No build step, no bundler, no framework
- No backend — everything runs client-side
- Hosted on Vercel's free tier

I intentionally went with no frameworks for this one. The whole thing is form inputs that generate JSON-LD in real-time. React/Vue/Svelte would've been overkill — this is just DOM manipulation and string templating.

**Why I built it:** The free schema generator landscape got pretty barren recently. Google deprecated their Structured Data Markup Helper, SchemaApp put theirs behind a paywall. I needed something fast for my own projects and figured "how hard can a form-to-JSON tool be?"

Turns out not that hard. The interesting part was getting all the edge cases right — nested schema objects, optional fields that shouldn't appear as empty strings, arrays that need proper formatting, etc.

**Stuff I'm happy with:**
- Lighthouse scores are solid since there's literally nothing to load
- Real-time preview updates as you type
- Mobile works fine (I use it on my phone more than desktop honestly)

**Stuff I'd improve:**
- Could add more schema types (there are dozens)
- Might add a "validate against Google's API" feature
- The CSS could use some work on tablet breakpoints

Source is on GitHub if anyone wants to look at the code or contribute. Feedback welcome — especially if the generated JSON-LD has any issues. I've tested against Google's Rich Results Test but edge cases always sneak through.
