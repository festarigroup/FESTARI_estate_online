import { publicApi } from "../axios-wrapper"

export interface ResendOtpType{
    email: string
}

export const ResendOtp = async (data: ResendOtpType) => {
    try{
        const response = await publicApi.post("/auth/verify_otp", {
            ...data
        })
        return response
    }catch(err){
        return err
    }
}
