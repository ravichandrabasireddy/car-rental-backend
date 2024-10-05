import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { ConflictException } from '@nestjs/common';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (user) {
            throw new ConflictException('Email already exists');
        }
        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                hashedPassword: await hash(dto.password, 10),
                role: dto.role,
            }
        });
        const { hashedPassword, ...result } = newUser;
        return result;
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
               email: email
            }
        })
    }

    async getUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }

}
