import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';

@Module({
	imports: [PrismaModule, UserModule, AuthModule],
	controllers: [AppController],
	providers: [AppService, PrismaService, EmailService],
})
export class AppModule {}
