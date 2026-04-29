import { getPosts } from "@/lib/posts";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const posts = getPosts();
  const featuredImage = posts[0]?.imagePath ?? "/images/placeholder1.jpg";

  return (
    <main>
      <Navigation />
      <Hero featuredImage={featuredImage} />
      <Gallery posts={posts} />
      <Footer />
    </main>
  );
}
