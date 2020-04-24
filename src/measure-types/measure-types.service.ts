import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasureType } from './measure-types.entity';

@Injectable()
export class MeasureTypesService extends TypeOrmCrudService<MeasureType> {

  @InjectRepository(MeasureType)
  private measureRepository: Repository<MeasureType>;

  constructor(
    @InjectRepository(MeasureType)
      measureTypeRepository: Repository<MeasureType>,
  ) {
    super(measureTypeRepository);
  }
}