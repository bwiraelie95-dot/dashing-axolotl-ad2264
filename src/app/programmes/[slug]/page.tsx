import PublicationDetail from "@/components/public/PublicationDetail";
import { getPublicSite, local } from "@/lib/public/cms";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getPublicSite();
  const item = site.programs.find((x) => x.slug === slug);
  return {
    title: local(item, "title", site.lang) + " — ACV",
    description: local(item, "summary", site.lang),
    alternates: { canonical: `/programmes/${slug}` },
    openGraph: { images: item?.coverImage ? [String(item.coverImage)] : [] },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PublicationDetail slug={(await params).slug} kind="programmes" />;
}
