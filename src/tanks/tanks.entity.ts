import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Measure } from '../measures/measures.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Tank {

  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ nullable: false })
  name: string;

  @ManyToOne(type => User, user => user.tanks)
  user: User;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(type => Measure, measure => measure.tank)
  measures: Measure[];
}