import { redirect } from "next/navigation";

export default async function ReturnsRedirectPage({ searchParams }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(params || {}).toString();
  redirect(queryString ? `/refund?${queryString}` : "/refund");
}

