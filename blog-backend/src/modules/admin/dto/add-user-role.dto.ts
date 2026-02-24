import { IsNotEmpty, IsString } from "class-validator";


export class AddUserRoleDto {
    @IsString()
    @IsNotEmpty()
    roleName: 'Admin' | 'Author' | 'Reader';
}