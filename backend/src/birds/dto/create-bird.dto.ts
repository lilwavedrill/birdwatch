import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateBirdDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  conservationStatus?: string;

  @IsOptional()
  @IsNumber()
  wingspan?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  speciesId?: number;

  @IsOptional()
  @IsNumber()
  habitatId?: number;
}
