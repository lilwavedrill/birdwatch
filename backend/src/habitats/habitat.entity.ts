import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Bird } from '../birds/bird.entity';

@Entity('habitats')
export class Habitat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, nullable: true })
  climate: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Bird, (bird) => bird.habitat)
  birds: Bird[];
}
