import { Module } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { MeasuresController } from './measures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasureType } from '../measure-types/measure-types.entity';
import { Measure } from './measures.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Measure])],
  providers: [MeasuresService],
  controllers: [MeasuresController],
  exports: [MeasuresService],
})
export class MeasuresModule {
}
