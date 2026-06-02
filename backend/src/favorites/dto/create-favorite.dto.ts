import { IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsNumber()
  birdId: number;
}
