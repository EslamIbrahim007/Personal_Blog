import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user-role.entity';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    role?: UserRole;
}
