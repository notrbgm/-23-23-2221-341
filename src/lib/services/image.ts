import sharp from "sharp";
import { createHash } from "crypto";
import { mkdir, access, writeFile, readdir, unlink } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpeg" | "webp" | "avif" | "png";
}

interface CacheEntry {
  id: number;
  url: string;
  path: string;
  format: string;
  width: number | null;
  height: number | null;
  quality: number;
  createdAt: Date;
  accessedAt: Date;
}

const CACHE_DIR = "static/image-cache";
const DEFAULT_QUALITY = 80;
const DEFAULT_FORMAT = "webp";
const CACHE_CLEANUP_DAYS = 7;

export class ImageService {
  private static instance: ImageService;

  private constructor() {
    this.ensureCacheDir();
    this.scheduleCleanup();
  }

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  private async ensureCacheDir() {
    try {
      await access(CACHE_DIR);
    } catch {
      await mkdir(CACHE_DIR, { recursive: true });
    }
  }

  private generateCacheKey(url: string, options: ImageOptions): string {
    const hash = createHash("md5");
    hash.update(url + JSON.stringify(options));
    return hash.digest("hex");
  }

  private getCachePath(key: string, format: string): string {
    return join(CACHE_DIR, `${key}.${format}`);
  }

  private scheduleCleanup() {

    setInterval(() => this.cleanupCache(), 24 * 60 * 60 * 1000);
  }

  async cleanupCache(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - CACHE_CLEANUP_DAYS);


      const oldEntries = await prisma.$queryRaw<CacheEntry[]>`
        SELECT * FROM image_cache
        WHERE accessedAt < ${cutoffDate}
      `;


      await Promise.all(
        oldEntries.map(async (entry) => {
          try {
            await unlink(join("static", entry.path));
            await prisma.$executeRaw`
            DELETE FROM image_cache WHERE id = ${entry.id}
          `;
          } catch (error) {
            console.error("Error cleaning up cache entry:", error);
          }
        }),
      );
    } catch (error) {
      console.error("Error during cache cleanup:", error);
    }
  }

  async optimizeImage(
    url: string,
    options: ImageOptions = {},
  ): Promise<string> {
    const {
      width,
      height,
      quality = DEFAULT_QUALITY,
      format = DEFAULT_FORMAT,
    } = options;

    const cacheKey = this.generateCacheKey(url, options);
    const cachePath = this.getCachePath(cacheKey, format);
    const relativePath = cachePath.replace("static", "");

    try {

      const cached = await prisma.$queryRaw<CacheEntry[]>`
        SELECT * FROM image_cache
        WHERE url = ${url}
          AND format = ${format}
          AND width = ${width || null}
          AND height = ${height || null}
          AND quality = ${quality}
        LIMIT 1
      `;

      if (cached.length > 0) {

        await prisma.$executeRaw`
          UPDATE image_cache
          SET accessedAt = ${new Date()}
          WHERE id = ${cached[0].id}
        `;
        return cached[0].path;
      }


      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());

      let pipeline = sharp(buffer);


      if (width || height) {
        pipeline = pipeline.resize(width, height, {
          fit: "cover",
          withoutEnlargement: true,
        });
      }


      switch (format) {
        case "jpeg":
          pipeline = pipeline.jpeg({ quality });
          break;
        case "webp":
          pipeline = pipeline.webp({ quality });
          break;
        case "avif":
          pipeline = pipeline.avif({ quality });
          break;
        case "png":
          pipeline = pipeline.png({ quality });
          break;
      }

      const optimizedBuffer = await pipeline.toBuffer();
      await writeFile(cachePath, optimizedBuffer);


      await prisma.$executeRaw`
        INSERT INTO image_cache (url, path, format, width, height, quality, createdAt, accessedAt)
        VALUES (
          ${url},
          ${relativePath},
          ${format},
          ${width || null},
          ${height || null},
          ${quality},
          ${new Date()},
          ${new Date()}
        )
      `;

      return relativePath;
    } catch (error) {
      console.error("Image optimization error:", error);
      throw error;
    }
  }

  async generateResponsiveSet(
    url: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280],
  ): Promise<string[]> {
    const promises = breakpoints.map((width) =>
      this.optimizeImage(url, { width, format: "webp" }),
    );

    return Promise.all(promises);
  }

  async generateSrcSet(
    url: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280],
  ): Promise<string> {
    const paths = await this.generateResponsiveSet(url, breakpoints);
    return paths
      .map((path, index) => `${path} ${breakpoints[index]}w`)
      .join(", ");
  }


  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const imageService = ImageService.getInstance();
