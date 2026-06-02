import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  latinName?: string;

  @IsOptional()
  @IsString()
  family?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
