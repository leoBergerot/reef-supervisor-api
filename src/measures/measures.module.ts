import { Module } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { MeasuresController } from './measures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasureType } from './measures.type.entity';
import { Measure } from './measures.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Measure, MeasureType])],
  providers: [MeasuresService],
  controllers: [MeasuresController],
  exports: [MeasuresService],
})
export class MeasuresModule {
}
