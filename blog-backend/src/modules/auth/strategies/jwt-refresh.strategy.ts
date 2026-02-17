// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request } from 'express';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
//     constructor(private configService: ConfigService, private authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService.get<string>('jwt.secret') || process.env.JWT_SECRET || 'your-secret-key',
//             passReqToCallback: true,
//         });
//     }

//     async validate(req: Request, payload: any) {
//         const refreshToken = req.get('authorization').replace('Bearer ', '');
//         const user = await this.authService.verifyUserRefreshToken(refreshToken, payload.email);
//         return { userId: payload.sub, username: payload.email, role: payload.role };
//     }
// }
