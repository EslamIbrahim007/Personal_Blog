import { IsNotEmpty, IsString } from "class-validator";


export class AddUserRoleDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    roleName: 'Admin' | 'Author' | 'Reader';
}