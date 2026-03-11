# Hacker News Submission

## Title
Show HN: ProtoCol – Free JSON-LD structured data generator (no signup, no backend)

## URL
https://schemaforge-seven.vercel.app

## Description (for the first comment)

I built a client-side tool that generates JSON-LD structured data for 8 common schema.org types: FAQ, LocalBusiness, Product, Article, Event, HowTo, Organization, and Recipe.

Motivation: Google deprecated their Structured Data Markup Helper, and SchemaApp (the main third-party alternative) recently removed their free tier. I needed something for my own projects and the existing options were either paywalled, required signup, or produced questionable output.

Technical details:
- Pure HTML/CSS/vanilla JS, no framework, no build step
- No backend — all generation happens client-side
- Zero dependencies (no npm packages)
- Hosted on Vercel free tier
- Forms generate JSON-LD in real-time as you type

The tricky part wasn't the UI — it's getting the JSON-LD output right. Schema.org specs have nested objects, optional fields that shouldn't render as empty strings, arrays that need to degrade gracefully when they have one item vs many, etc. I spent more time on the output correctness than everything else combined.

All generated markup passes Google's Rich Results Test for the types they support.

Interested in feedback, especially from people who work with structured data regularly. Planning to add more schema types if there's interest.
