import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, updateUserDto } from './dto/create-user.dto';

@ApiTags('user')
@Controller('api/v1/user')
export class UserController {
  	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Get all users' })
	@Get()
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	@ApiOperation({ summary: 'Get user by ID' })
	@Get(':id')
	async getUserById(@Param('id') id: string) {
		return await this.userService.getUserById(id);
	}

	@ApiOperation({ summary: 'Find user by email' })
	@Get('email/:email')
	async findUserByEmail(@Param('email') email: string) {
		return await this.userService.findUserByEmail(email);
	}

	@ApiOperation({ summary: 'Get user by username' })
	@Get('username/:username')
	async getUserByUsername(@Param('username') username: string) {
		return await this.userService.findUserByUsername(username);
	}

	@ApiOperation({ summary: 'Update user by ID' })
	@Patch('update/:id')
	async updateUserById(@Body() data: updateUserDto, @Param('id') id: string) {
		return await this.userService.updateUser(id, data);
	}

	@ApiOperation({ summary: 'Create User' })
	@Post('create')
	async createUser(@Body() data: CreateUserDto) {
		return await this.userService.createUser(data);
	}

}
