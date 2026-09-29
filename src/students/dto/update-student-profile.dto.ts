import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  yearOfStudy?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
