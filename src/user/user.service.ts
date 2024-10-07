import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
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
        
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
               email: email
            }
        })
    }

    async getUserById(id: string) {
        const user= await this.prisma.user.findUnique({
            where: {
                id: id  
            },
            include: { address: true },
        })
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            phoneNumber:user.phoneNumber,            
            address:{
                street:user.address?.street,
                city:user.address?.city,
                state:user.address?.state,
                zip:user.address?.zip,
                country:user.address?.country
            }
        }
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const updateData: any = {};

        if (dto.phoneNumber !== undefined) {
            updateData.phoneNumber = dto.phoneNumber;
        }

        if (dto.address) {
            updateData.address = {
                upsert: {
                    create: {},
                    update: {},
                },
            };

            // Only include address fields that are provided
            for (const field of ['street', 'city', 'state', 'zip', 'country']) {
                if (dto.address[field] !== undefined) {
                    updateData.address.upsert.create[field] = dto.address[field];
                    updateData.address.upsert.update[field] = dto.address[field];
                }
            }
        }

        // Check if there's any data to update
        if (Object.keys(updateData).length === 0) {
            throw new ConflictException('No data to update');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: { address: true },
        });
        return {
            id:updatedUser.id,
            name:updatedUser.name,
            email:updatedUser.email,
            role:updatedUser.role,
            phoneNumber:updatedUser.phoneNumber,            
            address:{
                street:updatedUser.address?.street,
                city:updatedUser.address?.city,
                state:updatedUser.address?.state,
                zip:updatedUser.address?.zip,
                country:updatedUser.address?.country
            }
        }
    }

}
