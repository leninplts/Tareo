import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
} from './config/constants';
import { Worker } from './worker/entities/worker.entity';
import { TareoModule } from './tareo/tareo.module';
import { Tareo } from './tareo/entities/tareo.entity';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    WorkerModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configSerive: ConfigService) => ({
        type: 'mysql',
        host: configSerive.get<string>(MYSQL_HOST),
        port: configSerive.get<number>(MYSQL_PORT),
        username: configSerive.get<string>(MYSQL_USER),
        password: configSerive.get<string>(MYSQL_PASS),
        database: configSerive.get<string>(MYSQL_DB),
        entities: [Worker, Tareo],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TareoModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
