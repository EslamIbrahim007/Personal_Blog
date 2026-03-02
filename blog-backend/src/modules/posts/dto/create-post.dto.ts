import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
export class CreatPostTranslationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug?: string;

    @IsString()
    @IsNotEmpty()
    excerpt?: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    language: "en" | "ar";
}

export class CreatePostDto {
    @Type(() => CreatPostTranslationDto)
    @ValidateNested({ each: true })
    translations: CreatPostTranslationDto[];
}