"use client";

function isEmpty(schema) {
  if (!schema) return true;
  if (Array.isArray(schema)) return schema.length === 0;
  return typeof schema === "object" && Object.keys(schema).length === 0;
}

export default function JsonLd({ schema, data }) {
  const payload = schema ?? data;
  if (isEmpty(payload)) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
