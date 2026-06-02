import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitat } from './habitat.entity';
import { HabitatsService } from './habitats.service';
import { HabitatsController } from './habitats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habitat])],
  controllers: [HabitatsController],
  providers: [HabitatsService],
  exports: [HabitatsService],
})
export class HabitatsModule {}
