import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Bird } from '../birds/bird.entity';

@Entity('favorites')
@Unique(['userId', 'birdId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Bird, (bird) => bird.favorites, { eager: true })
  @JoinColumn({ name: 'birdId' })
  bird: Bird;

  @Column()
  birdId: number;

  @CreateDateColumn()
  addedAt: Date;
}
