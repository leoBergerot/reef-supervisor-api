import { Module } from '@nestjs/common';
import { TanksController } from './tanks.controller';
import { TanksService } from './tanks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tank } from './tanks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tank])],
  controllers: [TanksController],
  providers: [TanksService],
  exports: [TanksService],
})
export class TanksModule {
}
