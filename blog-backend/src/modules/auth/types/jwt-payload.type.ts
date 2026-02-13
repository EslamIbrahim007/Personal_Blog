export type JwtAccessPayload = {
    sub: string; // userId
    roles: string[]; // ["Admin", "Author"]
    permissions: string[]; // ["POST_CREATE", ...]
};