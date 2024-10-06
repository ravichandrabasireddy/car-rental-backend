import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const EXPIRE_TIME=20*1000;

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}
   

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        const payload = { 
            sub: {
                name: user.name,
                role: user.role
            },
            username: user.email,
            id: user.id
        };

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            backend_tokens:{
                access_token: await this.jwtService.signAsync(payload,{
                    expiresIn: '20s',
                    secret: process.env.JWT_SECRET_KEY
                }),
                refresh_token: await this.jwtService.signAsync(payload,{
                    expiresIn: '7d',
                    secret: process.env.JWT_REFRESH_TOKEN_KEY
                }),
                expires_in:new Date().setTime(new Date().getTime() + EXPIRE_TIME)
            }
            
        };

    }

    async validateUser(dto: LoginDto) {
        const user = await this.userService.findUserByEmail(dto.username);

        if (user && (await compare(dto.password, user.hashedPassword))) {
            const { hashedPassword, ...result } = user;
            return result;
        }
        
        throw new UnauthorizedException('Invalid credentials');

    }

    async refreshToken(user: any) {
        const payload = { 
            sub: user.sub,
            username: user.email,
            id: user.id
        };
        return {
            backend_tokens:{
                access_token: await this.jwtService.signAsync(payload,{
                    expiresIn: '20s',
                    secret: process.env.JWT_SECRET_KEY
                }),
                refresh_token: await this.jwtService.signAsync(payload,{
                    expiresIn: '7d',
                    secret: process.env.JWT_REFRESH_TOKEN_KEY
                }),
                expires_in:new Date().setTime(new Date().getTime() + EXPIRE_TIME)
            }
            
        };
         
    }

}
