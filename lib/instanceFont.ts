import { FONT_BY_ID, DEFAULT_FONT_ID } from "./fontCatalog";
import type { FontParams } from "./types";

interface HbExports {
  memory: WebAssembly.Memory;
  malloc(n: number): number;
  free(p: number): void;
  hb_blob_create(data: number, len: number, mode: number, ud: number, destroy: number): number;
  hb_blob_destroy(b: number): void;
  hb_blob_get_length(b: number): number;
  hb_blob_get_data(b: number, lenOut: number): number;
  hb_face_create(blob: number, index: number): number;
  hb_face_destroy(f: number): void;
  hb_face_reference_blob(f: number): number;
  hb_subset_input_create_or_fail(): number;
  hb_subset_input_destroy(i: number): void;
  hb_subset_input_keep_everything(i: number): void;
  hb_subset_input_pin_axis_location(i: number, face: number, tag: number, value: number): number;
  hb_subset_or_fail(face: number, input: number): number;
}

let exportsPromise: Promise<HbExports> | null = null;
const fontCache = new Map<string, ArrayBuffer>();

async function getExports(): Promise<HbExports> {
  if (!exportsPromise) {
    exportsPromise = (async () => {
      const bytes = await (await fetch("/hb-subset.wasm")).arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {});
      return instance.exports as unknown as HbExports;
    })();
  }
  return exportsPromise;
}

async function getFontBytes(file: string): Promise<ArrayBuffer> {
  let buf = fontCache.get(file);
  if (!buf) {
    buf = await (await fetch(file)).arrayBuffer();
    fontCache.set(file, buf);
  }
  return buf;
}

function HB_TAG(s: string): number {
  return (
    ((s.charCodeAt(0) << 24) | (s.charCodeAt(1) << 16) | (s.charCodeAt(2) << 8) | s.charCodeAt(3)) >>> 0
  );
}

export async function instanceFont(params: FontParams): Promise<Uint8Array<ArrayBuffer>> {
  const def = FONT_BY_ID[params.base] ?? FONT_BY_ID[DEFAULT_FONT_ID];
  const e = await getExports();
  const fontBytes = new Uint8Array(await getFontBytes(def.file));

  const heap = () => new Uint8Array(e.memory.buffer);

  const fontPtr = e.malloc(fontBytes.length);
  heap().set(fontBytes, fontPtr);

  const blob = e.hb_blob_create(fontPtr, fontBytes.length, 2, 0, 0);
  const face = e.hb_face_create(blob, 0);
  const input = e.hb_subset_input_create_or_fail();
  e.hb_subset_input_keep_everything(input);

  for (const axis of def.axes) {
    const value = params.axes[axis.tag];
    if (typeof value === "number" && Number.isFinite(value)) {
      e.hb_subset_input_pin_axis_location(input, face, HB_TAG(axis.tag), value);
    }
  }

  const result = e.hb_subset_or_fail(face, input);
  if (!result) {
    e.hb_subset_input_destroy(input);
    e.hb_face_destroy(face);
    e.hb_blob_destroy(blob);
    e.free(fontPtr);
    throw new Error("font instancing failed");
  }

  const outBlob = e.hb_face_reference_blob(result);
  const len = e.hb_blob_get_length(outBlob);
  const dataPtr = e.hb_blob_get_data(outBlob, 0);
  const out = new Uint8Array(len);
  out.set(heap().subarray(dataPtr, dataPtr + len));

  e.hb_blob_destroy(outBlob);
  e.hb_face_destroy(result);
  e.hb_subset_input_destroy(input);
  e.hb_face_destroy(face);
  e.hb_blob_destroy(blob);
  e.free(fontPtr);

  return out;
}
