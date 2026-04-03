import type { TextureEntry } from "../utils/types";
import { resolveAssetPath } from "../utils/config";
import { decodeBLP, getBLPImageData } from "war3-model";

const BLACK_COLOR_KEY_PATHS = /\/resources\/Resource/;

export class TextureManager {
  private cache = new Map<string, TextureEntry>();
  whiteTex!: WebGLTexture;
  private gl!: WebGL2RenderingContext;

  init(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.whiteTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.whiteTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );
  }

  load(path: string): TextureEntry {
    if (this.cache.has(path)) return this.cache.get(path)!;
    const entry = this.makeEntry();
    this.cache.set(path, entry);
    if (path.endsWith(".blp")) {
      void this.loadBlp(path, entry, false);
    } else {
      this.loadPng(path, entry, false);
    }
    return entry;
  }

  loadRepeat(path: string): TextureEntry {
    const key = path + "?repeat";
    if (this.cache.has(key)) return this.cache.get(key)!;
    const entry = this.makeEntry();
    this.cache.set(key, entry);
    if (path.endsWith(".blp")) {
      void this.loadBlp(path, entry, true);
    } else {
      this.loadPng(path, entry, true);
    }
    return entry;
  }

  get(path: string): WebGLTexture {
    const e = this.cache.get(path);
    return e ? e.tex : this.whiteTex;
  }

  preload(paths: string[]) {
    paths.forEach((p) => this.load(p));
  }

  private makeEntry(): TextureEntry {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );
    return { tex, width: 1, height: 1, loaded: false };
  }

  private loadPng(path: string, entry: TextureEntry, repeat: boolean) {
    const img = new Image();
    img.onload = () => this.uploadImage(img, entry, repeat);
    img.src = resolveAssetPath(path);
  }

  private async loadBlp(path: string, entry: TextureEntry, repeat: boolean) {
    try {
      const res = await fetch(resolveAssetPath(path));
      if (!res.ok) return;
      const ab = await res.arrayBuffer();
      const blp = decodeBLP(ab);
      const imgData = getBLPImageData(blp, 0);
      const pixels = new Uint8ClampedArray(imgData.data);
      if (BLACK_COLOR_KEY_PATHS.test(path)) {
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] > 224 && pixels[i] <= 10 && pixels[i + 1] <= 10 && pixels[i + 2] <= 10) {
            pixels[i + 3] = 0;
          }
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = imgData.width;
      canvas.height = imgData.height;
      const ctx2d = canvas.getContext("2d")!;
      ctx2d.putImageData(new ImageData(pixels, imgData.width, imgData.height), 0, 0);
      this.uploadImage(canvas, entry, repeat);
    } catch {
      // silently keep white 1×1 placeholder
    }
  }

  private uploadImage(
    source: HTMLImageElement | HTMLCanvasElement,
    entry: TextureEntry,
    repeat: boolean,
  ) {
    const gl = this.gl;
    const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.bindTexture(gl.TEXTURE_2D, entry.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    entry.width = source.width;
    entry.height = source.height;
    entry.loaded = true;
  }
}
