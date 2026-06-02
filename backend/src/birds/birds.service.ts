import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Bird } from './bird.entity';
import { CreateBirdDto } from './dto/create-bird.dto';
import { UpdateBirdDto } from './dto/update-bird.dto';

@Injectable()
export class BirdsService {
  constructor(
    @InjectRepository(Bird)
    private birdsRepo: Repository<Bird>,
  ) {}

  async findAll(search?: string, speciesId?: number, habitatId?: number): Promise<Bird[]> {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (speciesId) where.speciesId = speciesId;
    if (habitatId) where.habitatId = habitatId;
    return this.birdsRepo.find({ where, relations: ['species', 'habitat'] });
  }

  async findById(id: number): Promise<Bird> {
    const bird = await this.birdsRepo.findOne({
      where: { id },
      relations: ['species', 'habitat'],
    });
    if (!bird) throw new NotFoundException(`Bird #${id} not found`);
    return bird;
  }

  async create(dto: CreateBirdDto): Promise<Bird> {
    const bird = this.birdsRepo.create(dto);
    return this.birdsRepo.save(bird);
  }

  async update(id: number, dto: UpdateBirdDto): Promise<Bird> {
    const bird = await this.findById(id);
    Object.assign(bird, dto);
    return this.birdsRepo.save(bird);
  }

  async remove(id: number): Promise<void> {
    const bird = await this.findById(id);
    await this.birdsRepo.remove(bird);
  }
}
