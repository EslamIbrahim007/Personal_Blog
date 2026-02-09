import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable() 
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
      //1. get email from request
      const {email} = createUserDto;
      //2. check if user with same email exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
        const user = this.userRepository.create(createUserDto)
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