import fs from "fs";
import path from "path";

export interface PostData {
  id: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  is_video: boolean;
  imagePath: string;
  date: Date;
}

interface RawPost {
  id: string;
  timestamp: number;
  caption: string;
  hashtags: string[];
  mentions: string[];
  is_video: boolean;
  image_filename: string;
}

export function getPosts(): PostData[] {
  const dataPath = path.join(process.cwd(), "..", "data", "posts.json");
  const raw: RawPost[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  return raw.map((p) => ({
    id: p.id,
    caption: p.caption,
    hashtags: p.hashtags,
    mentions: p.mentions,
    is_video: p.is_video,
    imagePath: `/images/${p.image_filename}`,
    date: new Date(p.timestamp * 1000),
  }));
}
