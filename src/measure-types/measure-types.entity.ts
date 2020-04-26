import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Measure } from '../measures/measures.entity';

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

  @Column({ nullable: true, type: 'float' })
  minValueRecommended: number;

  @Column({ nullable: true, type: 'float' })
  maxValueRecommended: number;

  @OneToMany(type => Measure, measure => measure.type)
  measures: any;
}