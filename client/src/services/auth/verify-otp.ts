import { publicApi } from "../axios-wrapper"

export interface VerifyOtp{
    email: string
    otp: string
}

export const VerifyOtp = async (data: VerifyOtp) => {
    try{
        const response = await publicApi.post("/auth/verify_otp", {
            ...data
        })
        console.log(response)
    }catch(err){
        console.log(err)
    }
}
