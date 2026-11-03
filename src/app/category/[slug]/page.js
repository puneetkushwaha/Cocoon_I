import { permanentRedirect } from "next/navigation";

export default async function CategoryRedirectPage({ params }) {
  const unwrappedParams = await params;
  permanentRedirect(`/collections/${unwrappedParams.slug}`);
}
