import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(72)
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}
