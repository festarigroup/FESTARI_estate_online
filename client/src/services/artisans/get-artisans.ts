import { Artisan } from "@/types/Artisan";
import { publicApi } from "../axios-wrapper";

export interface GetArtisansOptions {
  status?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const getArtisans = async (options: GetArtisansOptions = {}) => {
  try {
    const response = await publicApi.get<Array<Artisan>>("/artisans/", {
      params: {
        status: options.status,
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