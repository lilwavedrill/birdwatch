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
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}

  @Get()
  findMy(@Request() req) {
    return this.favsService.findByUser(req.user.sub);
  }

  @Post()
  add(@Body() dto: CreateFavoriteDto, @Request() req) {
    return this.favsService.add(dto, req.user.sub);
  }

  @Delete(':birdId')
  remove(@Param('birdId', ParseIntPipe) birdId: number, @Request() req) {
    return this.favsService.remove(birdId, req.user.sub);
  }
}
