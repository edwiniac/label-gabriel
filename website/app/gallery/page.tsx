import { getPosts } from "@/lib/posts";
import { Navigation } from "@/components/Navigation";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

interface PageProps {
  searchParams: { tag?: string };
}

export default function GalleryPage({ searchParams }: PageProps) {
  const posts = getPosts();
  return (
    <main>
      <Navigation />
      <Gallery posts={posts} initialTag={searchParams.tag} />
      <Footer />
    </main>
  );
}
