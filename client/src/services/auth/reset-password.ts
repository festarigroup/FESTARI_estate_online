import { publicApi } from "../axios-wrapper"

export interface ResetPasswordType{
    uid: string // userId
    token: string
    new_password: string
}

export const ResetPassword = async (data: ResetPasswordType) => {
    try{
        const response = await publicApi.post("/auth/reset_password", {
            ...data
        })
        console.log(response)
    }catch(err){
        console.log(err)
    }
}
