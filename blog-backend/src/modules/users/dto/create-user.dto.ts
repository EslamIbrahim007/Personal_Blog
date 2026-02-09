import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { UserRole } from '../types/user-role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole;
}
