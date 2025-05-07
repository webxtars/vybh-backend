import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AuthDto {

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

export class RefreshDto {
    @IsString()
    @ApiProperty()
    refreshToken!: string;
}
