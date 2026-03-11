import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./Dtos/create-category.dto";
import { Category } from "./entities/category.entity";
import { buildSlug } from "src/common/utils/slug.util";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const name = createCategoryDto.name.toLowerCase().trim();
        const slug = buildSlug(name);
        const existing = await this.categoryRepo.findOne({ where: [{name}, {slug}] });
        if (existing) {
            throw new BadRequestException(`Category ${name} already exists`);
        }
        const category = this.categoryRepo.create({ name, slug });

        return this.categoryRepo.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepo.find({
            order: { name: 'ASC' },
        });
    }

    async findByIds(ids: string[]): Promise<Category[]> {
        if (!ids || ids.length === 0) {
            return [];
        }
        return this.categoryRepo.findBy(
            ids.map(id => ({ id }))
        );
    }

    async update(id: string, dto: CreateCategoryDto): Promise<Category> {
        //1. find category
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        //2. normalize name and slug
        const name = dto.name.toLowerCase().trim();
        const slug = buildSlug(name);
        const existing = await this.categoryRepo.findOne({ where: [{name}, {slug}] });
        if (existing && existing.id !== id) {
            throw new BadRequestException(`Category ${name} already exists`);
        }

        category.name = name;
        category.slug = slug;

        return this.categoryRepo.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        await this.categoryRepo.delete(id);
    }
}
