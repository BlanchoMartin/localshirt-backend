import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleWeb {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: false })
  name: string;

  @Column({ nullable: false, unique: true })
  url: string;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @Column({ nullable: true, unique: false })
  brand: string;

  @Column({ nullable: false, unique: false })
  price: number;

  @Column({ nullable: true, unique: false })
  country: string;

  @Column({ nullable: true, unique: false })
  material: string;

  @Column({ nullable: true, unique: false })
  transport: string;

  @Column({ nullable: false, unique: false })
  ethical_score: number;

  @Column({ nullable: false, unique: false })
  ecological_score: number;

  @Column({ nullable: false, unique: false })
  local_score: number;

  @Column({ nullable: false, unique: false })
  creation_date: Date;

  @Column({ nullable: false, unique: false })
  type: string;

  @Column({ nullable: false, unique: false })
  image_data: string;

  @Column({ nullable: true, type: 'integer', array: true })
  rgb: number[];
}
