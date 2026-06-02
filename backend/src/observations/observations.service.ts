import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './observation.entity';
import { CreateObservationDto } from './dto/create-observation.dto';

@Injectable()
export class ObservationsService {
  constructor(
    @InjectRepository(Observation)
    private obsRepo: Repository<Observation>,
  ) {}

  findAll(): Promise<Observation[]> {
    return this.obsRepo.find({ relations: ['bird', 'user'], order: { observedAt: 'DESC' } });
  }

  findByUser(userId: number): Promise<Observation[]> {
    return this.obsRepo.find({
      where: { userId },
      relations: ['bird'],
      order: { observedAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Observation> {
    const obs = await this.obsRepo.findOne({ where: { id }, relations: ['bird', 'user'] });
    if (!obs) throw new NotFoundException(`Observation #${id} not found`);
    return obs;
  }

  async create(dto: CreateObservationDto, userId: number): Promise<Observation> {
    const obs = this.obsRepo.create({ ...dto, userId });
    return this.obsRepo.save(obs);
  }

  async remove(id: number): Promise<void> {
    const obs = await this.findById(id);
    await this.obsRepo.remove(obs);
  }
}
