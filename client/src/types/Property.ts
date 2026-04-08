import { PropertyStatus } from "./PropertyStatus"

export interface Property{
    id: string
    title: string
    description: string
    price: number
    location: string
    is_featured: boolean
    status: PropertyStatus
    media_urls: Array<string>
    views_count: number
    created_at: Date
    updated_at: Date
    owner: string // user id
}