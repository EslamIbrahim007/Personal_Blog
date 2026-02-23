"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const argon2 = require("argon2");
const user_entity_1 = require("./entities/user.entity");
const roles_entity_1 = require("./entities/roles.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
let UsersService = class UsersService {
    constructor(userRepository, roleRepository, userRoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }
    async create(createUserDto) {
        let { email, username } = createUserDto;
        email = email.toLowerCase();
        username = username.toLowerCase();
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: email },
                { username: username }
            ]
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or username already exists');
        }
        const hashedPassword = await argon2.hash(createUserDto.password);
        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            isActive: true,
            emailVerifiedAt: null,
        });
        await this.userRepository.save(user);
        const defaultRole = await this.roleRepository.findOne({ where: { name: 'Reader' } });
        if (!defaultRole) {
            throw new common_1.NotFoundException('Default role not found');
        }
        const userRole = this.userRoleRepository.create({
            userId: user.id,
            roleId: defaultRole.id,
        });
        await this.userRoleRepository.save(userRole);
        return user;
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOneByEmail(email) {
        return this.userRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: {
                userRoles: {
                    role: {
                        rolePermissions: {
                            permission: true,
                        },
                    },
                },
            },
        });
    }
    async assignRoleToUser(userId, roleName) {
        const role = await this.roleRepository.findOne({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const existing = await this.userRoleRepository.findOne({
            where: {
                userId,
                roleId: role.id,
            },
        });
        if (existing)
            return;
        const userRole = this.userRoleRepository.create({
            userId,
            roleId: role.id,
        });
        await this.userRoleRepository.save(userRole);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(roles_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map