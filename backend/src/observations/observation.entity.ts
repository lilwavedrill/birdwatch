import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Bird } from '../birds/bird.entity';

@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  location: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  observedAt: Date;

  @ManyToOne(() => User, (user) => user.observations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Bird, (bird) => bird.observations, { eager: true })
  @JoinColumn({ name: 'birdId' })
  bird: Bird;

  @Column()
  birdId: number;
}
