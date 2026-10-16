/** Structured data for search engines, rendered into the page's HTML. */
export function JsonLd({ data }: { data: object }) {
  // Escaping "<" keeps any text inside the JSON from closing the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
