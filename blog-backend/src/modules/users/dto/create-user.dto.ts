import { IsString, IsInt, IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';
import { UserRole } from '../types/user-role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

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
    role: UserRole;
}
