import ScrollEffects from "@/components/home/ScrollEffects";
import Header from "@/components/home/Header";
import HeroCarousel from "@/components/home/HeroCarousel";
import HomeSections from "@/components/home/HomeSections";
import DonationSection from "@/components/home/DonationSection";
import Footer from "@/components/home/Footer";
import { getPublicSite } from "@/lib/public/cms";
export const dynamic="force-dynamic";
export default async function HomePage() {
  const site = await getPublicSite();
  return (
    <>
      <Header language={site.lang} />
      <ScrollEffects />
      <main id="accueil" className="w-full bg-surface">
        <HeroCarousel banners={site.banners} language={site.lang} />
        <HomeSections
          language={site.lang}
          stats={site.homeStats}
          programs={site.programs}
          articles={site.articles}
        />
        <DonationSection language={site.lang} />
      </main>
      <Footer />
    </>
  );
}
