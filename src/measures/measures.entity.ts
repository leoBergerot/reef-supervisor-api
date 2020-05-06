import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Tank } from '../tanks/tanks.entity';
import { MeasureType } from '../measure-types/measure-types.entity';
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
  @Column({ nullable: false, type:'float' })
  value: number;

  @IsOptional({ groups: [UPDATE, CREATE] })
  @Column({ nullable: false })
  createdAt: Date;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(type => Tank, tank => tank.measures, { onDelete: 'CASCADE' })
  tank: Tank;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ManyToOne(type => MeasureType, type => type.measures)
  type: MeasureType;
}