import { Module } from '@nestjs/common';
import { MeasureTypesController } from './measure-types.controller';
import { MeasureTypesService } from './measure-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasureType } from './measure-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeasureType])],
  controllers: [MeasureTypesController],
  providers: [MeasureTypesService],
  exports: [MeasureTypesService],
})
export class MeasureTypesModule {
}
