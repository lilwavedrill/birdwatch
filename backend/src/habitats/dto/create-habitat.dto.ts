import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateHabitatDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  climate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
