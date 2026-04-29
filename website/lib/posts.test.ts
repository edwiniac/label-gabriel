import { describe, it, expect, vi, beforeAll } from "vitest";

const mockReadFileSync = vi.fn(() =>
  JSON.stringify([
    {
      id: "ABC123",
      timestamp: 1710504000,
      caption: "Spring collection #labelgabriel",
      hashtags: ["labelgabriel"],
      mentions: [],
      is_video: false,
      image_filename: "ABC123.jpg",
    },
  ])
);

vi.mock("fs", () => ({
  default: { readFileSync: mockReadFileSync },
  readFileSync: mockReadFileSync,
}));

vi.mock("path", async (importOriginal) => {
  const actual = await importOriginal<typeof import("path")>();
  return {
    ...actual,
    join: vi.fn(() => "/mocked/posts.json"),
  };
});

import type { PostData } from "./posts";

let getPosts: () => PostData[];

beforeAll(async () => {
  const mod = await import("./posts");
  getPosts = mod.getPosts;
});

describe("getPosts", () => {
  it("returns an array of PostData", () => {
    const posts = getPosts();
    expect(posts).toHaveLength(1);
  });

  it("parses unix timestamp as Date", () => {
    const [post] = getPosts();
    expect(post.date).toBeInstanceOf(Date);
    expect(post.date.getFullYear()).toBe(2024);
  });

  it("derives imagePath from image_filename", () => {
    const [post] = getPosts();
    expect(post.imagePath).toBe("/images/ABC123.jpg");
  });

  it("exposes all required fields", () => {
    const [post] = getPosts();
    const required: (keyof PostData)[] = [
      "id", "caption", "hashtags", "mentions", "is_video", "imagePath", "date",
    ];
    for (const field of required) {
      expect(post).toHaveProperty(field);
    }
  });
});
