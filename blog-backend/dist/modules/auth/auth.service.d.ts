import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly userRepository;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, userRepository: Repository<User>, logger: Logger);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: User;
    }>;
    login(LoginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: User;
    }>;
    verifyUser(LoginDto: LoginDto): Promise<User>;
    verifyUserRefreshToken(refreshToken: string, email: string): Promise<User>;
    logout(email: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
