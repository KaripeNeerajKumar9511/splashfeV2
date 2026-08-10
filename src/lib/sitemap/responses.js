import "server-only";

import { NextResponse } from "next/server";
import {
  SITEMAP_PLAIN_HEADERS,
  SITEMAP_XML_HEADERS,
} from "./constants";

/** @returns {boolean} */
export function isSitemapDisabled() {
  return process.env.NEXT_DISABLE_SITEMAP === "1";
}

/** @returns {string} */
export function getSitemapBaseUrl() {
  return (process.env.NEXT_SITEMAP_URL || "").replace(/\/+$/, "");
}

/** @returns {NextResponse} */
export function sitemapDisabledResponse() {
  return new NextResponse("Not Found", {
    status: 404,
    headers: SITEMAP_PLAIN_HEADERS,
  });
}

/** @returns {NextResponse} */
export function missingSitemapUrlResponse() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<error>NEXT_SITEMAP_URL is not configured</error>",
    "",
  ].join("\n");

  return new NextResponse(body, {
    status: 500,
    headers: SITEMAP_XML_HEADERS,
  });
}

/** @returns {NextResponse} */
export function plainNotFoundResponse() {
  return new NextResponse("Not Found", {
    status: 404,
    headers: SITEMAP_PLAIN_HEADERS,
  });
}

/**
 * @param {string} xml
 * @param {number} [status=200]
 * @returns {NextResponse}
 */
export function xmlResponse(xml, status = 200) {
  return new NextResponse(xml, {
    status,
    headers: SITEMAP_XML_HEADERS,
  });
}
