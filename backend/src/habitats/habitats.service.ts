import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitat } from './habitat.entity';
import { CreateHabitatDto } from './dto/create-habitat.dto';

@Injectable()
export class HabitatsService {
  constructor(
    @InjectRepository(Habitat)
    private habitatsRepo: Repository<Habitat>,
  ) {}

  findAll(): Promise<Habitat[]> {
    return this.habitatsRepo.find();
  }

  async findById(id: number): Promise<Habitat> {
    const habitat = await this.habitatsRepo.findOne({ where: { id } });
    if (!habitat) throw new NotFoundException(`Habitat #${id} not found`);
    return habitat;
  }

  async create(dto: CreateHabitatDto): Promise<Habitat> {
    const habitat = this.habitatsRepo.create(dto);
    return this.habitatsRepo.save(habitat);
  }

  async update(id: number, dto: Partial<CreateHabitatDto>): Promise<Habitat> {
    const habitat = await this.findById(id);
    Object.assign(habitat, dto);
    return this.habitatsRepo.save(habitat);
  }

  async remove(id: number): Promise<void> {
    const habitat = await this.findById(id);
    await this.habitatsRepo.remove(habitat);
  }
}
