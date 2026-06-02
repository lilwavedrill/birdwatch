import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favsRepo: Repository<Favorite>,
  ) {}

  findByUser(userId: number): Promise<Favorite[]> {
    return this.favsRepo.find({ where: { userId }, relations: ['bird'] });
  }

  async add(dto: CreateFavoriteDto, userId: number): Promise<Favorite> {
    const exists = await this.favsRepo.findOne({
      where: { userId, birdId: dto.birdId },
    });
    if (exists) throw new ConflictException('Already in favorites');
    const fav = this.favsRepo.create({ ...dto, userId });
    return this.favsRepo.save(fav);
  }

  async remove(birdId: number, userId: number): Promise<void> {
    const fav = await this.favsRepo.findOne({ where: { userId, birdId } });
    if (!fav) throw new NotFoundException('Not in favorites');
    await this.favsRepo.remove(fav);
  }
}
