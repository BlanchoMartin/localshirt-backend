import {ArrayMaxSize, IsArray, IsBoolean, IsNegative, IsNumber, IsOptional, IsString} from 'class-validator';

export class ArticleWebDTO {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  brand: string;

  @IsNumber()
  price: number;

  @IsString()
  country: string;

  @IsString()
  material: string;

  @IsString()
  transport: string;

  @IsString()
  image: string;
}
