import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { PrismaService } from './infra/database/prisma.service';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const emoji =
              {
                error: '❌',
                warn: '⚠️ ',
                info: 'ℹ️ ',
                debug: '🔍',
                verbose: '📝',
              }[level.toLowerCase()] || '📋';

            const prettyMeta = Object.keys(meta).length
              ? `\n${JSON.stringify(meta)}`
              : '';

            return `${emoji} ${timestamp} [${level}] ${message}${prettyMeta}`;
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, { logger });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  prismaService.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;

    if (duration > 500) {
      logger.warn(
        `[Prisma] Consulta lenta: ${params.model}.${params.action} (${duration}ms)`,
        {
          model: params.model,
          action: params.action,
          duration,
        },
      );
    }

    return result;
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('User Hub Platform API')
    .setDescription('API documentation for User Hub Platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
