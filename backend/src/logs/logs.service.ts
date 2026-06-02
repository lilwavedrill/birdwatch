import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepo: Repository<Log>,
  ) {}

  findAll(): Promise<Log[]> {
    return this.logsRepo.find({ order: { timestamp: 'DESC' }, take: 100 });
  }

  async createLog(data: Partial<Log>): Promise<Log> {
    const log = this.logsRepo.create(data);
    return this.logsRepo.save(log);
  }
}
