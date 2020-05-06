import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Tank } from './tanks.entity';

@Injectable()
export class TanksService extends TypeOrmCrudService<Tank> {

  @InjectRepository(Tank)
  private tanksRepository: Repository<Tank>;

  constructor(
    @InjectRepository(Tank)
      tanksRepository: Repository<Tank>,
  ) {
    super(tanksRepository);
  }

  public async persistTank(tank: Tank) {
    return await this.tanksRepository.update(tank.id, tank);
  }
}
