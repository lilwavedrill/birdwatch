import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateObservationDto {
  @IsString()
  @MinLength(2)
  location: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  birdId: number;
}
