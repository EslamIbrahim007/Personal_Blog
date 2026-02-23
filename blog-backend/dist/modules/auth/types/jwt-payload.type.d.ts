export type JwtAccessPayload = {
    sub: string;
    roles: string[];
    permissions: string[];
};
