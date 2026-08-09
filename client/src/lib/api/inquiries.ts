import { apiPost } from "@/lib/api/client";

export interface CreatePropertyInquiryPayload {
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function createPropertyInquiry(payload: CreatePropertyInquiryPayload) {
  return apiPost<null>("/common/property-inquiries", payload, false);
}
