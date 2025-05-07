import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    /**
     * Validates the user credentials.
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @returns An object containing the user data and access/refresh tokens.
     * @throws BadRequestException if the credentials are invalid.
     */
    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException("Invalid Credentials");
        }

        console.log(user)

        if (!user.password || !bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException("Invalid Credentials");
        }

        return {
            user: this.userService.mapToUserResponse(user),
            accessToken: this.jwtService.sign({ ...this.userService.mapToUserResponse(user), type: 'access' }),
            refreshToken: this.jwtService.sign({ ...this.userService.mapToUserResponse(user), type: 'refresh' }, { expiresIn: process.env.JWT_REFRESH_EXPIRATION }),
        }
    }

    /**
     * Refreshes the access token using the refresh token.
     * @param refreshToken - The refresh token to validate.
     * @returns An object containing the new access token.
     * @throws NotFoundException if the user is not found.
     */
    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);

        const user = await this.prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return {
            accessToken: this.jwtService.sign({
                ...this.userService.mapToUserResponse(user),
                type: 'access',
            }),
        }
    }
}
