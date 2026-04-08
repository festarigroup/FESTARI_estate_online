import { privateApi } from "../axios-wrapper"

export const logout = async () => {
    try{
        const response = await privateApi.post("/auth/logout")
        return response
    }catch(err){
        return err
    }
}
