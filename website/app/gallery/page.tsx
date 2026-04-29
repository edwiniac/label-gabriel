import { getPosts } from "@/lib/posts";
import { Navigation } from "@/components/Navigation";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

export default function GalleryPage() {
  const posts = getPosts();
  return (
    <main>
      <Navigation />
      <Gallery posts={posts} />
      <Footer />
    </main>
  );
}
