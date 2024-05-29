import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class ImageUploadInput {
  @Field(() => GraphQLUpload)
  file: any;
}
