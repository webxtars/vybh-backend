import { ApiOperation, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

class CreateUserDto {

    @IsString()
    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
    })
    firstName: string;

    @IsString()
    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
    })
    lastName: string;

    @IsString()
    @ApiProperty({
        example: 'john_doe',
        description: 'Username of the user',
    })
    username: string;

    @IsEmail()
    @ApiProperty({
        example: 'john@gmail.com',
        description: 'Email of the user',
    })
    email: string;
    
    @IsString()
    @ApiProperty({
        example: 'password',
        description: 'Password of the user',
    })
    password: string;
}

class userResponseDto {

    @ApiProperty({
        example: '1',
        description: 'ID of the user',
    })
    id: string;

    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
    })
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
    })
    lastName: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Username of the user',
    })
    username: string;

    @ApiProperty({
        example: 'user@mail.com',
        description: 'Email of the user',
    })
    email: string;

    @ApiProperty({
        example: '2023-10-01T00:00:00.000Z',
        description: 'User created date',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-10-01T00:00:00.000Z',
        description: 'User updated date',
    })
    updatedAt: Date;
}

class updateUserDto {
    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
    })
    @ApiPropertyOptional()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
    })
    @IsString()
    @ApiPropertyOptional()
    lastName?: string;

}

export {
    CreateUserDto,
    userResponseDto,
    updateUserDto
}