import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/user.service';
import { RefreshJwtStrategy } from './strategies/refresh-token.guard';

@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService, LocalStrategy, RefreshJwtStrategy, JwtStrategy, ConfigService, UserService],
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	]
})
export class AuthModule {}
