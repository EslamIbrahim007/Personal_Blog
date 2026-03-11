import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { TagsService } from "./tags.service";
import { RequirePermissions } from "src/common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guards/permissions.guard";


    
@Controller('tags')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    @RequirePermissions('TAG_MANAGE')
    create(@Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findByIds([id]);
    }

    @Delete(':id')
    @RequirePermissions('TAG_MANAGE')
    remove(@Param('id') id: string) {
        return this.tagsService.remove(id);
    }
}