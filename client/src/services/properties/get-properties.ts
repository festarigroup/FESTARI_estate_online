import { Property } from "@/types/Property";
import { publicApi } from "../axios-wrapper";

export interface GetPropertiesOptions {
  status?: string;
  is_featured?: string;
  location?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const getProperties = async (options: GetPropertiesOptions = {}) => {
  try {
    const response = await publicApi.get<Array<Property>>("/properties/", {
      params: {
        status: options.status,
        is_featured: options.is_featured,
        location: options.location,
        search: options.search,
        ordering: options.ordering,
        page: options.page ?? 1,
        page_size: options.page_size ?? 10,
      },
    });

    return response.data;
  } catch (err) {
    return err
  }
};