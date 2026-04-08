import { User } from "@/types/User"
import { privateApi } from "../axios-wrapper"

export const logout = async () => {
    try{
        const response = await privateApi.post("/auth/logout")
        console.log(response)
    }catch(err){
        console.log(err)
    }
}
