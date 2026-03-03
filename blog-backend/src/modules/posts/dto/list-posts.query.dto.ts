import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class ListPostsQueryDto {
    @IsIn(["en", "ar"])
    lang: "en" | "ar";

    @IsString()
    @IsOptional()
    search?: string;

    @IsNumber()
    @IsOptional()
    @Min(1
    )
    page?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(50)
    limit?: number;

    @IsString()
    @IsOptional()
    sortBy?: string;

    @IsIn(["ASC", "DESC"])
    @IsOptional()
    sortOrder?: "ASC" | "DESC";
}