import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observation } from './observation.entity';
import { ObservationsService } from './observations.service';
import { ObservationsController } from './observations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Observation])],
  controllers: [ObservationsController],
  providers: [ObservationsService],
})
export class ObservationsModule {}
