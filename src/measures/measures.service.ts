import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Measure } from './measures.entity';

@Injectable()
export class MeasuresService extends TypeOrmCrudService<Measure> {

  @InjectRepository(Measure)
  private measureRepository: Repository<Measure>;

  constructor(
    @InjectRepository(Measure)
      measureRepository: Repository<Measure>,
  ) {
    super(measureRepository);
  }
}
