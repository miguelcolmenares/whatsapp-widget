import { loadSite } from "@/infrastructure";

/** Publish validated static fixtures below the configured base path, without serving source-only server-language files. */
export function getStaticPaths() {
  return loadSite().demos.assets.map((asset) => ({ params: { file: asset.path }, props: asset }));
}

/** Serve a prebuilt text asset with its explicit media type. No source file is interpreted as a program by this endpoint. */
export function GET({ props }: { props: { text: string; contentType: string } }) {
  return new Response(props.text, { headers: { "Content-Type": props.contentType } });
}
