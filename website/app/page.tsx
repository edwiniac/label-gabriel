import { getPosts } from "@/lib/posts";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { BrandStatement } from "@/components/BrandStatement";
import { PhotoStrip } from "@/components/PhotoStrip";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { LookbookTeaser } from "@/components/LookbookTeaser";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

const BRIDAL_TAGS = ["bridalsaree", "keralabride", "bridalwear", "weddingdress", "bridalgown"];
const BAPTISM_TAGS = ["baptismdress", "christeningoutfit", "baptismday", "babybaptism"];
const ETHNIC_TAGS = ["indianfashion", "ethnicwear", "pattayasalwar", "traditionalelegance"];
const CUSTOM_TAGS = ["custommade", "custombridal", "handcrafted", "kidsboutique"];

function firstWith(posts: ReturnType<typeof getPosts>, tags: string[]) {
  return posts.find((p) => p.hashtags.some((h) => tags.includes(h.toLowerCase())));
}

export default function HomePage() {
  const posts = getPosts();

  const bridal = firstWith(posts, BRIDAL_TAGS);
  const baptism = firstWith(posts, BAPTISM_TAGS);
  const ethnic = firstWith(posts, ETHNIC_TAGS);
  const custom = firstWith(posts, CUSTOM_TAGS);

  return (
    <main>
      <Navigation />
      <Hero />
      <Marquee />
      <BrandStatement />
      <PhotoStrip />
      <ServicesShowcase />
      <LookbookTeaser bridal={bridal} baptism={baptism} ethnic={ethnic} custom={custom} />
      <ContactCTA />
      <Footer />
    </main>
  );
}
