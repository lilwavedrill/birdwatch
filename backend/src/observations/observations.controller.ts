import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('observations')
export class ObservationsController {
  constructor(private readonly obsService: ObservationsService) {}

  @Get()
  findAll() {
    return this.obsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@Request() req) {
    return this.obsService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.obsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateObservationDto, @Request() req) {
    return this.obsService.create(dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.obsService.remove(id);
  }
}
