import CustomError from "./CustomError";
import jwt, { type JwtPayload } from "jsonwebtoken"

type Tokens = {
    accessToken: string,
    refreshToken: string
}

type TokenPayload = {
    id: string;
    roles: Array<string>;
    type: "access"|"refresh";
};

class TokenService {
    private readonly accessTokenSecret: string | undefined;
    private readonly refreshTokenSecret: string | undefined;

    constructor() {
        const accessTokenSecret = process.env.ACCESS_TOKEN;
        const refreshTokenSecret = process.env.REFRESH_TOKEN; 

        if (!accessTokenSecret || !refreshTokenSecret) {
            throw new CustomError("Tokens not generated", 500)
        }
        this.accessTokenSecret = accessTokenSecret;
        this.refreshTokenSecret = refreshTokenSecret;
    }

    generateTokens(user: {id: string, roles: Array<string>}): Tokens {
        const payload: TokenPayload = {
            id: user.id,
            roles: user.roles,
            type: "access"
        };
        const accessToken = jwt.sign(payload, this.accessTokenSecret as string, { algorithm: 'HS256', expiresIn: '1d' });
        const refreshToken = jwt.sign({...payload, type:"refresh"}, this.refreshTokenSecret as string, {expiresIn: '7d', algorithm:'HS256'});

        return {accessToken, refreshToken}
    }

    refreshAccessToken(refreshToken:string): string {
        try {
            const payload = jwt.verify(refreshToken, this.refreshTokenSecret as string) as JwtPayload & { type?: string };
            if (payload.type !== "refresh") {
                throw new CustomError("Invalid refresh token", 401);
            }
            const { type, exp, iat, nbf, jti, ...claims } = payload as JwtPayload;
            return jwt.sign({ ...claims, type: "access" }, this.accessTokenSecret as string, {
                algorithm: "HS256",
                expiresIn: "1d",
            });
        } catch {
            throw new CustomError("Refresh token invalid or expired", 401);
        }
    }

    verifyAccessToken(accessToken: string): TokenPayload {
        try {
            const payload = jwt.verify(accessToken, this.accessTokenSecret as string) as JwtPayload | TokenPayload;
            if (typeof payload === "string"){
                throw new CustomError("Invalid token payload", 401);
            }
            if (payload.type !== "access" || typeof payload.id !== "string" || !Array.isArray(payload.roles)){
                throw new CustomError("Invalid token payload", 401);
            }

            return {
                id: String(payload.id),
                roles: payload.roles,
                type: "access",
            };
        } catch (err) {
            throw err;
        }
    }
}

const tokenService = new TokenService();
export default tokenService;