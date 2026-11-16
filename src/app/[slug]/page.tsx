import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ContactForm from "@/components/public/ContactForm";
import PublicCollection from "@/components/public/PublicCollection";
import { pages, programPages } from "@/lib/public/pages";
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: pages[slug]
      ? `${pages[slug].title} — ACV`
      : "Page introuvable — ACV",
  };
}
export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return (
    <>
      <Header />
      <main className="public-page">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <a href="/" className="admin-text-link">
            ← Accueil
          </a>
          <p className="admin-eyebrow mt-10">AFRICA COMMUNITY VILLAGE</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-container mb-6">
            {page.title}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mb-12 leading-8">
            {page.intro}
          </p>
          {page.resource && <PublicCollection resource={page.resource} />}{" "}
          {page.paragraphs && (
            <div className="admin-card max-w-3xl space-y-6 leading-8">
              {page.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <a href="/contact" className="admin-text-link inline-block">
                Contacter ACV →
              </a>
            </div>
          )}
          {slug === "programmes" && (
            <div className="grid md:grid-cols-2 gap-6">
              {programPages.map(([path, title, intro]) => (
                <a
                  className="admin-card transition-shadow hover:shadow-lg"
                  key={path}
                  href={`/${path}`}
                >
                  <h2>{title}</h2>
                  <p className="mt-4 leading-7">{intro}</p>
                  <span className="admin-text-link inline-block mt-6">
                    Découvrir ce pilier →
                  </span>
                </a>
              ))}
            </div>
          )}
          {slug === "contact" && (
            <div className="max-w-2xl">
              <ContactForm />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
