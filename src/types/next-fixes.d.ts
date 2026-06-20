/**
 * next/types.d.ts is missing from this install, so `export * from './types'`
 * in next/index.d.ts re-exports nothing. Patch Metadata and NextConfig here.
 */
declare module "next" {
  export type {
    Metadata,
    ResolvedMetadata,
    ResolvingMetadata,
    MetadataRoute,
    Viewport,
  } from "next/dist/lib/metadata/types/metadata-interface";
  export type { NextConfig } from "next/dist/server/config-shared";
}
