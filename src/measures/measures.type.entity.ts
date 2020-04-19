import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Measure } from './measures.entity';

@Entity()
export class MeasureType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  shortName: string;

  @Column({ nullable: false })
  unit: string;

  @OneToMany(type => Measure, measure => measure.type)
  measures: any;
}