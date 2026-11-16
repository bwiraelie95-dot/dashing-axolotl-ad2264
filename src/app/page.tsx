import ScrollEffects from "@/components/home/ScrollEffects";
import Header from "@/components/home/Header";
import HeroCarousel from "@/components/home/HeroCarousel";
import HomeSections from "@/components/home/HomeSections";
import DonationSection from "@/components/home/DonationSection";
import Footer from "@/components/home/Footer";
export default function HomePage() {
  return (
    <>
      <Header />
      <ScrollEffects />
      <main id="accueil" className="w-full bg-surface">
        <HeroCarousel />
        <HomeSections />
        <DonationSection />
      </main>
      <Footer />
    </>
  );
}
