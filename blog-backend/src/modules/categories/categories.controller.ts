import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateCategoryDto } from "./Dtos/create-category.dto";
import { CategoriesService } from "./categories.service";
import { RequirePermissions } from "src/common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guards/permissions.guard";


    
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @RequirePermissions('CATEGORY_MANAGE')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findByIds([id]);
    }

    @Delete(':id')
    @RequirePermissions('CATEGORY_MANAGE')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}