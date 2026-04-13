import { Property } from "@/types/Property";
import { publicApi } from "../axios-wrapper";

export const getProperty = async (id: string) => {
  try {
    const response = await publicApi.get<Property>(`/properties/${id}`);
    return response.data;
  } catch (err) {
    return err
  }
};