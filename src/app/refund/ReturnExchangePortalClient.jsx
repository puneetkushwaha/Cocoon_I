"use client";

import { useSearchParams } from "next/navigation";
import ReturnExchangePortal from "@/components/ReturnExchangePortal";

export default function ReturnExchangePortalClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <ReturnExchangePortal initialOrderId={orderId} />;
}
