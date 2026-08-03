import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export type UploadFolder = "officers" | "members" | "gallery";

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.";
  }
  if (file.size > MAX_SIZE) {
    return "Ukuran file maksimal 2MB.";
  }
  return null;
}

export function generateFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  return `${randomUUID()}.${ext}`;
}

export async function saveFile(
  file: File,
  folder: UploadFolder
): Promise<string> {
  const filename = generateFilename(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = join(
    process.cwd(),
    "public",
    "uploads",
    folder,
    filename
  );
  await writeFile(filePath, buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  const filePath = join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // File may not exist, ignore
  }
}