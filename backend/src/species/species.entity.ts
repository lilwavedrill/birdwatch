import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Bird } from '../birds/bird.entity';

@Entity('species')
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 200, nullable: true })
  latinName: string;

  @Column({ length: 100, nullable: true })
  family: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Bird, (bird) => bird.species)
  birds: Bird[];
}
