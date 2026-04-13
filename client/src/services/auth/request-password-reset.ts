import { publicApi } from "../axios-wrapper"

export interface RequestPasswordResetType{
    email: string
}

export const RequestPasswordReset = async (data: RequestPasswordResetType) => {
    try{
        const response = await publicApi.post("/auth/request_password_reset", {
            ...data
        })
        return response
    }catch(err){
        return err
    }
}
