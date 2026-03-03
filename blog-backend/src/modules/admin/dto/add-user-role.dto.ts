import { IsIn, IsNotEmpty, IsString } from "class-validator";


export class AddUserRoleDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['Admin', 'Author', 'Reader'])
    roleName: 'Admin' | 'Author' | 'Reader';
}