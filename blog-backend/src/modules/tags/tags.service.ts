import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTagDto } from "./dto/create-tag.dto";
import { Tag } from "./entities/tag.entity";
import { buildSlug } from "src/common/utils/slug.util";


@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepo: Repository<Tag>,
    ) {}

    async create(createTagDto: CreateTagDto): Promise<Tag> {
        //1. normalize name and slug
        const name = createTagDto.name.toLowerCase().trim();
        const slug = buildSlug(name);
        //2. check if exists
        const existing = await this.tagRepo.findOne({ where: [{name}, {slug}] });
        //3. throw error if exists
        if (existing) {
            throw new BadRequestException(`Tag ${name} already exists`);
        }
        //4. create tag
        const tag = this.tagRepo.create({ name, slug });
        //5. save tag
        return this.tagRepo.save(tag);
    }

    async findAll(): Promise<Tag[]> {
        //1. find all tags
        return this.tagRepo.find({
            order: { name: 'ASC' },
        });
    }

    async findByIds(ids: string[]): Promise<Tag[]> {
        //1. check if ids is empty
        if (!ids || ids.length === 0) {
            return [];
        }
        //2. find tags by ids
        return this.tagRepo.findBy(
            ids.map(id => ({ id }))
        );
    }

    async update(id: string, dto: CreateTagDto): Promise<Tag> {
        //1. find tag
        const tag = await this.tagRepo.findOne({ where: { id } });
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        //2. normalize name and slug
        const name = dto.name.toLowerCase().trim();
        const slug = buildSlug(name);
        const existing = await this.tagRepo.findOne({ where: [{name}, {slug}] });
        if (existing && existing.id !== id) {
            throw new BadRequestException(`Tag ${name} already exists`);
        }

        tag.name = name;
        tag.slug = slug;

        return this.tagRepo.save(tag);
    }

    async remove(id: string): Promise<void> {
        //1. find tag
        const tag = await this.tagRepo.findOne({ where: { id } });
        //2. check if tag exists
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        //2. delete tag
        await this.tagRepo.delete(id);
    }
}
