import { IsString, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  titre: string;

  @IsString()
  artists: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}
