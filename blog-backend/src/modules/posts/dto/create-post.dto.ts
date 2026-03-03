import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
export class CreatPostTranslationDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    slug?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    excerpt?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    content: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['en', 'ar'])
    language: "en" | "ar";
}

export class CreatePostDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatPostTranslationDto)
    translations: CreatPostTranslationDto[];
}