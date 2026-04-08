export interface Artisan{
    id: string
    bio: string
    service_category: object
    hourly_rate: number
    status: string
    media_urls: Array<string>
    created_at: Date
    updated_at: Date
    user: string // user id
}