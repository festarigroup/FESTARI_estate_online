import { Property } from "@/types/Property";
import { privateApi } from "../axios-wrapper";
import { uploadPropertyImage } from "./upload-image";

export interface UpdatePropertyType {
  title: string;
  description: string;
  price: number;
  location: string;
  is_featured?: boolean;
  file?: File
}

export const updateProperty = async (id: string, data: UpdatePropertyType) => {
  try {
    const response = await privateApi.put<Property>(`/properties/${id}`, {
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