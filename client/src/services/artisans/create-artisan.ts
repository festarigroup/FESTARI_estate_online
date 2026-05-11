import { Artisan } from "@/types/Artisan";
import { privateApi } from "../axios-wrapper";
import { uploadArtisanImage } from "./upload-image";

export interface CreateArtisanType {
  bio: string;
  service_categories: string;
  hourly_rate: number;
  file?: File
}

export const createArtisan = async (data: CreateArtisanType) => {
  try {
    const response = await privateApi.post<Artisan>("/artisans/", {
        ...data
    });

    if(!data.file){
        return response.data;
    }
    await uploadArtisanImage({artisanId: response.data.id, file: data.file})
    return response.data;
  } catch (err) {
    return err
  }
};