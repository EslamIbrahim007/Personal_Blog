import { Injectable, UnauthorizedException ,Logger} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import{RegisterDto} from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly logger: Logger,
    ) {}

    async register(createUserDto: CreateUserDto) {
        //1. Check if user exists
        const user = await this.usersService.findOneByEmail(createUserDto.email);
        if (user) {
            throw new UnauthorizedException('User already exists');
        }
        //2. Create user
        const createdUser = await this.usersService.create(createUserDto);
        //3. Generate JWT token
        const payload = { email: createdUser.email, sub: createdUser.id, role: createdUser.role };
        //4. hash password
        createdUser.password = await bcrypt.hash(createdUser.password, 10); 
        //5. save user
        await this.userRepository.save(createdUser);
        //6. return access token
        return {
            access_token: this.jwtService.sign(payload),
            user: createdUser,
        };
    };
    
    async login(LoginDto: LoginDto) {
        //1.expired refresh token
        const expirationMs = this.configService.get<number>('JWT_EXPIRATION_MS');
        const expirationDate = new Date(Date.now() + expirationMs);
        const refreshExpirationMs = this.configService.get<number>('JWT_REFRESH_EXPIRATION_MS');
        const refreshExpirationDate = new Date(Date.now() + refreshExpirationMs);
        
        //2. Check if user exists
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        //3. Check if password is valid
        const isPasswordValid = await bcrypt.compare(LoginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        //4. Generate JWT token
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload,{ expiresIn: this.configService.get<number>('JWT_EXPIRATION_MS')});
        const refreshToken = this.jwtService.sign(payload,{ expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION_MS')});
        //5. save refresh token
        user.refreshToken = refreshToken;
        await this.userRepository.save(user);
        //6. return access token
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user,
        };
    };

    //verifyUser
    async verifyUser(LoginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        //2. Check if password is valid
        const isPasswordValid = await bcrypt.compare(LoginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        //3.return user
        return user;
    }

    //verifyUserRefreshToken
    async verifyUserRefreshToken(refreshToken: string,email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        //2. Check if refresh token is valid
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        //3.return user
        return user;
    }
    //logout
    async logout(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        user.refreshToken = null;
        this.logger.log(`User ${user.email} logged out`);
        await this.userRepository.save(user);
        return {
            message: 'User logged out successfully',
        };
    }

    // refresh token
    async refreshToken(refreshToken: string) {
        const user = await this.usersService.findOneByEmail(refreshToken);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
}
