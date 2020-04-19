import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import databaseConfig from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TanksModule } from './tanks/tanks.module';
import { Tank } from './tanks/tanks.entity';
import { MeasuresModule } from './measures/measures.module';
import { Measure } from './measures/measures.entity';
import { MeasureType } from './measures/measures.type.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<string>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Tank, Measure, MeasureType],
        synchronize: true,
        autoLoadEntities: true,
      } as TypeOrmModuleOptions),
    }),
    UsersModule,
    AuthModule,
    TanksModule,
    MeasuresModule,
  ],
  controllers: [AppController],
})

export class AppModule {
  constructor(private connection: Connection) {
  }
}
