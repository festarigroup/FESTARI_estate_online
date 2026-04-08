export interface Hotel{
    id: string
    name: string
    description: string
    location: string
    nightly_rate: string
    status: string
    media_urls: Array<string>
    created_at: Date
    updated_at: Date
    manager: string // userId
}