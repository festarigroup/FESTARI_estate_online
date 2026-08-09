import { UserRow } from "#app/types/UserTypes.js";

export const toUserGetDto = (user: UserRow) => {
    const {
        updated_at, payment_provider_customer_id, password_hash, ...data
    } =  user;
    return data;
}