import { ConflictException, Injectable, NotFoundException, Logger, Inject, } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        //1. get email, username,  from request
        const { email, username } = createUserDto;
        //2. check if user with same email exists
        const existingUser = await this.userRepository.findOne({ where: { email: email, username: username } });
        if (existingUser) {
            throw new ConflictException('User with this email or username already exists');
        }
        //3. hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        //4. create user
        const user = this.userRepository.create({ ...createUserDto, password: hashedPassword })
        return this.userRepository.save(user)
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id)
    }
}