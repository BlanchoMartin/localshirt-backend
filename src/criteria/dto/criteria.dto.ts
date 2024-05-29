import { IsString } from 'class-validator';

export class CriteriaDTO {
  @IsString() tag: string;
  @IsString() type: string;
  @IsString() additionalCriteria: string;
}
