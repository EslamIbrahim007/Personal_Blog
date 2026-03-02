
export class ListPostsQueryDto {
    lang: "en" | "ar";
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}