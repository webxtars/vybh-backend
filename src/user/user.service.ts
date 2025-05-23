import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, updateUserDto, userResponseDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/email/email.service';

/**
 * UserService is responsible for handling user-related operations.
 * It interacts with the PrismaService to perform CRUD operations on the user model.
 * The service provides methods to create, update, fetch, and find users by email.
 * It also handles exceptions and returns appropriate responses.
 */
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService
    ) {}

    /**
     * Fetches all users from the database.
     * @returns An object containing the list of users and the count of users.
     */
    async getAllUsers() {
        const users = await this.prisma.user.findMany();
        return {
            users: users.map(user => this.mapToUserResponse(user)),
            count: users.length,
            "message": "Users fetched successfully",
        }
    }

    /**
     * Get a user by ID.
     * @param id - The ID of the user to fetch.
     * @returns An object containing the user data and a success message.
     * @throws NotFoundException if the user is not found.
     *
     */
    async getUserById(id: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            return {
                user: this.mapToUserResponse(user),
                "message": "User fetched successfully",
            }
        } catch (error) {
            return new NotFoundException("User not found");
        }
    }

    /**
     * Find a user by email.
     * @param email - The email of the user to find.
     * @returns An object containing the user data and a success message.
     * @throws NotFoundException if the user is not found.
     */
    async findUserByEmail(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            return {
                user: this.mapToUserResponse(user),
                "message": "User fetched successfully",
            }
        }
        catch (error) {
            return new NotFoundException("User not found");
        }
    }

    /**
     * Find user by username.
     * @param username - The username of the user to find.
     * @returns An object containing the user data and a success message.
     * @throws NotFoundException if the user is not found.
     */
    async findUserByUsername(username: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { username },
            });
            return {
                user: this.mapToUserResponse(user),
                "message": "User fetched successfully",
            }
        } catch (error) {
            return new NotFoundException("User not found");
        }
    }

    /**
     * Update a user by ID.
     * @param id - The ID of the user to update.
     * @param data - The data to update the user with.
     * @returns An object containing the updated user data and a success message.
     * @throws NotFoundException if the user is not found.
     */
    async updateUser(id: string, data: updateUserDto) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data,
            });
            return {
                user: this.mapToUserResponse(user),
                "message": "User updated successfully",
            }
        } catch (error) {
            return new NotFoundException("User not found");
        }
    }

    /**
     * Create a new user.
     * @param data - The data to create the user with.
     * @returns An object containing the created user data and a success message.
     * @throws BadRequestException if the user already exists.
     */
    async createUser(data: CreateUserDto) {
        try {
            const hashedpassword = await bcrypt.hash(data.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashedpassword,
                },
            });
            await this.emailService.sendViaBrevo(
                user.email,
            "Test Email",
            "Test Email",
            "Test Email"
            );
            return {
                user: this.mapToUserResponse(user),
                "message": "User created successfully",
            }
        } catch (error) {
            if (error.code === 'P2002') {
                return new BadRequestException("User already exists");
            }
            console.log(error);
            return new InternalServerErrorException("Error creating user");
        }
    }

    public mapToUserResponse(user: any): userResponseDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
