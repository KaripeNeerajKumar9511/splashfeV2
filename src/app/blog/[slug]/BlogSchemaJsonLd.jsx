import JsonLd from "@/lib/schema/JsonLd";
import { serializeBlogSchema } from "@/lib/generateBlogSchema";

export default function BlogSchemaJsonLd({ schema }) {
  return <JsonLd schema={serializeBlogSchema(schema)} />;
}
