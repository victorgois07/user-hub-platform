import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    this.logger.log('Conectando ao banco de dados...');
    try {
      await this.$connect();
      this.logger.log('Conectado com sucesso ao banco de dados.');
    } catch (error) {
      this.logger.error('Erro ao conectar ao banco de dados', error);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      this.logger.warn('Desconectando do banco de dados...');
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado do banco de dados.');
  }
}
