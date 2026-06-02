import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  method: string;

  @Column({ length: 500 })
  url: string;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn()
  timestamp: Date;
}
