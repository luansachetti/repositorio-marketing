// src/utils/readMarketingDrive.ts

import { drive_v3 } from "googleapis";
import { getDriveClient } from "./driveUtils.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const DRIVE_FOLDER_MARKETING = process.env.DRIVE_FOLDER_MARKETING;

export type MarketingNode = {
  id: string;
  name: string;
  slug: string;
  type: "folder" | "file";
  mimeType?: string | null;
  downloadUrl?: string;
  thumbUrl?: string;
  children?: MarketingNode[];
};

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function listChildren(
  drive: drive_v3.Drive,
  parentId: string
): Promise<MarketingNode[]> {
  const nodes: MarketingNode[] = [];

  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      orderBy: "name",
      pageToken,
    });

    for (const file of res.data.files || []) {
      if (!file.id || !file.name) continue;

      const isFolder =
        file.mimeType === "application/vnd.google-apps.folder";

      if (isFolder) {
        const children = await listChildren(drive, file.id);

        nodes.push({
          id: file.id,
          name: file.name,
          slug: slugify(file.name),
          type: "folder",
          children,
        });
      } else {
        nodes.push({
          id: file.id,
          name: file.name,
          slug: slugify(file.name),
          type: "file",
          mimeType: file.mimeType || null,
          downloadUrl: `${BACKEND_URL}/api/public/download?fileId=${file.id}`,
          thumbUrl: `${BACKEND_URL}/api/public/thumb?fileId=${file.id}`,
        });
      }
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return nodes;
}

export async function readMarketingDrive(): Promise<MarketingNode[]> {
  if (!DRIVE_FOLDER_MARKETING) {
    throw new Error("DRIVE_FOLDER_MARKETING não configurado");
  }

  const drive = getDriveClient();

  return listChildren(drive, DRIVE_FOLDER_MARKETING);
}
