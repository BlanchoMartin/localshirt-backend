import { IsString, IsBoolean, IsNumber, IsArray, IsOptional, ArrayMaxSize, IsDate, IsUUID } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

/**
 * Article DTO
 * 
 * @category DTOs
 * @class
 * @classdesc DTO for Articles
 */
export class ArticleDto {
  @IsString()
  name: string;
  @IsString()
  brand: string;
  @IsString()
  branddesc: string;
  image:Buffer;
  brandlogo:Buffer
  @IsString()
  redirection_url: string;
  @IsNumber()
  price: number;
  @IsString()
  description: string;
  @IsString()
  type: string;
  @IsString()
  ethicaldesc: string;
  @IsString()
  environnementdesc: string;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  rgb: number[];
  @IsDate()
  lastbought: Date;
  @IsDate()
  lastshown: Date;
  @IsDate()
  lastclick: Date;
}
