import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: true,
	});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	const config = new DocumentBuilder()
    .setTitle('VYBE API')
	.setDescription('API endpoints for vybe API gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

	const docs = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api/v1/docs', app, docs);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
