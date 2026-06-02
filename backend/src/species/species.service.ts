import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './species.entity';
import { CreateSpeciesDto } from './dto/create-species.dto';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private speciesRepo: Repository<Species>,
  ) {}

  findAll(): Promise<Species[]> {
    return this.speciesRepo.find();
  }

  async findById(id: number): Promise<Species> {
    const species = await this.speciesRepo.findOne({ where: { id } });
    if (!species) throw new NotFoundException(`Species #${id} not found`);
    return species;
  }

  async create(dto: CreateSpeciesDto): Promise<Species> {
    const species = this.speciesRepo.create(dto);
    return this.speciesRepo.save(species);
  }

  async update(id: number, dto: Partial<CreateSpeciesDto>): Promise<Species> {
    const species = await this.findById(id);
    Object.assign(species, dto);
    return this.speciesRepo.save(species);
  }

  async remove(id: number): Promise<void> {
    const species = await this.findById(id);
    await this.speciesRepo.remove(species);
  }
}
