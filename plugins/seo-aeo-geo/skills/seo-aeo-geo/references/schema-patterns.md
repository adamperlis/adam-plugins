# Schema Patterns for Ghost Themes

Ready-to-use JSON-LD blocks for `partials/schema/` in Ghost Handlebars themes.
All URLs use `absolute="true"`. Dates use ISO 8601. Organization always referenced by `@id`.

---

## Organization + NewsMediaOrganization (sitewide, non-home pages)

```handlebars
{{! partials/schema/sitewide-schema.hbs }}
{{#is "home"}}{{else}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "NewsMediaOrganization"],
      "@id": "{{@site.url}}#organization",
      "name": "{{@site.title}}",
      "url": "{{@site.url}}",
      "sameAs": ["https://your-main-domain.com"]
    },
    {
      "@type": "WebSite",
      "@id": "{{@site.url}}#website",
      "url": "{{@site.url}}",
      "name": "{{@site.title}}",
      "publisher": { "@id": "{{@site.url}}#organization" }
    }
  ]
}
</script>
{{/is}}
```

---

## WebSite + Full Organization (homepage only)

```handlebars
{{! partials/schema/website-schema.hbs }}
{{#is "home"}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "{{@site.url}}#website",
      "url": "{{@site.url}}",
      "name": "{{@site.title}}",
      "description": "{{@site.description}}",
      "publisher": { "@id": "{{@site.url}}#organization" },
      "inLanguage": "en-US"
    },
    {
      "@type": ["Organization", "NewsMediaOrganization"],
      "@id": "{{@site.url}}#organization",
      "name": "{{@site.title}}",
      "url": "{{@site.url}}",
      "description": "YOUR PUBLICATION DESCRIPTION",
      {{#if @site.logo}}
      "logo": {
        "@type": "ImageObject",
        "url": "{{img_url @site.logo}}",
        "@id": "{{@site.url}}#logo"
      },
      "image": { "@id": "{{@site.url}}#logo" },
      {{/if}}
      "sameAs": [
        "https://your-main-domain.com"
      ],
      "foundingDate": "YYYY",
      "founder": { "@type": "Person", "name": "FOUNDER NAME" },
      "knowsAbout": ["TOPIC 1", "TOPIC 2", "TOPIC 3"],
      "publishingPrinciples": "{{@site.url}}/about/"
    }
  ]
}
</script>
{{/is}}
```

---

## Article (BlogPosting + NewsArticle + speakable)

The `NewsArticle` co-type is the freshness signal for AI systems. The `speakable` spec
marks which CSS selectors contain the most extractable content for AI Overviews and voice.

```handlebars
{{! partials/schema/enhanced-schema.hbs — post section }}
{{#post}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["BlogPosting", "NewsArticle"],
      "@id": "{{url absolute="true"}}#article",
      "headline": "{{title}}",
      "description": "{{#if custom_excerpt}}{{custom_excerpt}}{{else}}{{excerpt}}{{/if}}",
      "datePublished": "{{date published_at format="YYYY-MM-DDTHH:mm:ssZ"}}",
      "dateModified": "{{date updated_at format="YYYY-MM-DDTHH:mm:ssZ"}}",
      {{#if feature_image}}
      "image": {
        "@type": "ImageObject",
        "url": "{{img_url feature_image size="xl"}}",
        "width": 1200,
        "height": 630
      },
      {{/if}}
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".gh-article-title", ".gh-article-excerpt", ".gh-content > p:first-of-type"]
      },
      "author": {
        "@type": "Person",
        "@id": "{{primary_author.url}}#author",
        "name": "{{primary_author.name}}",
        "url": "{{primary_author.url}}",
        "sameAs": [
          {{#if primary_author.website}}"{{primary_author.website}}"{{#if primary_author.twitter}},{{/if}}{{/if}}
          {{#if primary_author.twitter}}"https://twitter.com/{{primary_author.twitter}}"{{/if}}
        ]
      },
      "publisher": {
        "@type": ["Organization", "NewsMediaOrganization"],
        "@id": "{{@site.url}}#organization"
      },
      "isPartOf": { "@type": "WebSite", "@id": "{{@site.url}}#website" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "{{url absolute="true"}}" },
      {{#if tags}}
      "keywords": [{{#foreach tags}}"{{name}}"{{#unless @last}},{{/unless}}{{/foreach}}],
      {{/if}}
      {{#if primary_tag}}
      "articleSection": "{{primary_tag.name}}",
      {{/if}}
      "inLanguage": "en-US"
    }
  ]
}
</script>
{{/post}}
```

---

## CollectionPage + ItemList (tag/category archive pages)

The `about` entity tells AI what the collection is *about* — critical for Events/Jobs pages.

```handlebars
{{! partials/schema/itemlist-schema.hbs — tag section }}
{{#is "tag"}}
{{#tag}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["CollectionPage", "ItemList"],
  "url": "{{url absolute="true"}}",
  "name": "{{name}}",
  {{#if description}}
  "description": "{{description}}",
  {{/if}}
  "about": {
    "@type": "Thing",
    "name": "{{name}}"{{#if description}},
    "description": "{{description}}"{{/if}}
  },
  "isPartOf": { "@type": "WebSite", "@id": "{{@site.url}}#website" },
  "publisher": { "@type": "Organization", "@id": "{{@site.url}}#organization" },
  "itemListElement": [
    {{#foreach posts}}
    {
      "@type": "ListItem",
      "position": {{@number}},
      "name": "{{title}}",
      "url": "{{url absolute="true"}}"
    }{{#unless @last}},{{/unless}}
    {{/foreach}}
  ]
}
</script>
{{/tag}}
{{/is}}
```

---

## BreadcrumbList

```handlebars
{{! partials/schema/breadcrumb-schema.hbs }}
{{#post}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "{{@site.url}}" },
    {{#primary_tag}}
    { "@type": "ListItem", "position": 2, "name": "{{name}}", "item": "{{url absolute="true"}}" },
    {{/primary_tag}}
    {
      "@type": "ListItem",
      "position": {{#primary_tag}}3{{else}}2{{/primary_tag}},
      "name": "{{title}}",
      "item": "{{url absolute="true"}}"
    }
  ]
}
</script>
{{/post}}
```

---

## FAQ Schema (for posts or pages with FAQ sections)

Add this when a post contains a FAQ section. Use `{{#has tag="faq"}}` to make it conditional.

```handlebars
{{#has tag="faq"}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "QUESTION TEXT",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ANSWER TEXT"
      }
    }
  ]
}
</script>
{{/has}}
```

Note: FAQPage schema requires manual population — it can't be auto-generated from post content.
Best used on static pages with a known structure, not on all posts.

---

## Notes on Ghost-Specific Patterns

- Always use `{{url absolute="true"}}` inside `<script type="application/ld+json">` — relative URLs break schema validators
- `{{date updated_at format="YYYY-MM-DDTHH:mm:ssZ"}}` is the correct Ghost helper for `dateModified`
- `{{#is "home"}}...{{else}}...{{/is}}` is the correct pattern for "not home" — there is no `@is.home` data attribute
- Multiple `<script type="application/ld+json">` blocks on the same page are valid — Google processes all of them
- Validate with: https://validator.schema.org/ and Google's Rich Results Test
