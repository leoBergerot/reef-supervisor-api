import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Tank } from '../tanks/tanks.entity';
import { MeasureType } from './measures.type.entity';
import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Measure {

  public constructor() {
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  createdAt: Date;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(type => Tank, tank => tank.measures)
  tank: Tank;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(type => MeasureType, type => type.measures)
  type: MeasureType;
}