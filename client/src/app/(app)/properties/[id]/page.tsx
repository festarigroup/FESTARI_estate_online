import { ComingSoonPage } from "@/components/ComingSoonPage";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ComingSoonPage
      icon="Building2"
      title="Property Listing"
      description={`We're still building the full detail page for this listing (#${id}) — photo gallery, floor plan, and an inquiry form are on the way.`}
    />
  );
}
