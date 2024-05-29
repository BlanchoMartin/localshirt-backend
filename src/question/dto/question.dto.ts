import { IsBoolean, IsNumber, IsString } from 'class-validator';

/**
 * Question DTO
 * 
 * @category DTOs
 * @class
 * @classdesc DTO for Questions
 */
export class QuestionDTO {
    @IsString()
    content: string;

    @IsString()
    tag: string;

    @IsString()
    user_response_type: string;

  @IsNumber()
  factor: number;

    @IsBoolean()
    minimize: boolean;

    @IsString()
    criteria_application: string;

    @IsString()
    criteria_target: string;
}
