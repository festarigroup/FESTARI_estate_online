import { Role } from "./Role"

export interface User{
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    role: Role
    phone_number: string
    is_verified: boolean
}