import { Property } from "@/types/Property";
import { privateApi } from "../axios-wrapper";
import { uploadPropertyImage } from "./upload-image";

export interface CreatePropertyType {
  title: string;
  description: string;
  price: number;
  location: string;
  file?: File
}

export const createProperty = async (data: CreatePropertyType) => {
  try {
    const response = await privateApi.post<Property>("/properties/", {
        ...data
    });

    if(!data.file){
        return response.data;
    }
    await uploadPropertyImage({propertyId: response.data.id, file: data.file})
    return response.data;
  } catch (err) {
    return err
  }
};