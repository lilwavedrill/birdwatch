import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bird } from './bird.entity';
import { BirdsService } from './birds.service';
import { BirdsController } from './birds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bird])],
  controllers: [BirdsController],
  providers: [BirdsService],
  exports: [BirdsService],
})
export class BirdsModule {}
