import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOpportunityDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['ATTACHMENT', 'INTERNSHIP'])
  type?: 'ATTACHMENT' | 'INTERNSHIP';

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsIn(['OPEN', 'CLOSED', 'PENDING', 'REJECTED'])
  status?: 'OPEN' | 'CLOSED' | 'PENDING' | 'REJECTED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
