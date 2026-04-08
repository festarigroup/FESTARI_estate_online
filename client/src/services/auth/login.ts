import { User } from "@/types/User"
import { publicApi } from "../axios-wrapper"

export interface LoginType{
    email: string
    password: string
}

export const login = async (data: LoginType) => {
    try{
        const response = await publicApi.post<User>("/auth/login", {
            ...data
        })
        console.log(response)
    }catch(err){
        console.log(err)
    }
}

