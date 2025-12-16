import CollectionPage from "../components/shop/CollectionPage";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params; // ✅ Next 16 fix
  return <CollectionPage categorySlug={category} />;
}
