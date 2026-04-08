import { User } from "@/types/User"
import { publicApi } from "../axios-wrapper"
import { Role } from "@/types/Role"

export interface RegisterType{
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
    role: Role
}

export const register = async (data: RegisterType) => {
    try{
        const response = await publicApi.post<User>("/auth/register", {
            ...data
        })
        console.log(response)
    }catch(err){
        console.log(err)
    }
}
