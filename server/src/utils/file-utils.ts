import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

export const fileUtils = {
  async deleteFile(filePath: string): Promise<void> {
    try {
      await unlinkAsync(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
  },

  getFileNameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return path.basename(urlObj.pathname);
    } catch (error) {
      console.error("Error extracting filename from URL:", error);
      return null;
    }
  },
};
