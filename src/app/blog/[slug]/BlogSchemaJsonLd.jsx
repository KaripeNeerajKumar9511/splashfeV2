import { serializeBlogSchema } from "@/lib/generateBlogSchema";

export default function BlogSchemaJsonLd({ schema }) {
  const payload = serializeBlogSchema(schema);
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
