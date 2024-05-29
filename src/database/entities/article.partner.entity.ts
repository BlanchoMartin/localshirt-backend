import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticlePartner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: false })
  name: string;

  @Column({ nullable: false, unique: false })
  brand: string;

  @Column({ nullable: false, unique: false })
  email: string;

  @Column({ nullable: false, unique: false })
  redirection_url: string;

  @Column({ nullable: false, unique: false })
  country: string;

  @Column({ nullable: false, unique: false })
  material: string;

  @Column({ nullable: false, unique: false })
  transport: string;

  @Column({ nullable: false, unique: false })
  branddesc: string;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @Column({ type: 'bytea', nullable: true })
  brandlogo: Buffer;

  @Column({ nullable: false, unique: false })
  description: string;

  @Column({ nullable: false, unique: false })
  ethicaldesc: string;

  @Column({ nullable: false, unique: false })
  price: number;

  @Column({ nullable: false, unique: false })
  environnementdesc: string;

  @Column({ nullable: false, unique: false })
  ethical_score: number;

  @Column({ nullable: false, unique: false })
  ecological_score: number;

  @Column({ nullable: false, unique: false })
  local_score: number;

  @Column({ nullable: true, type: 'integer', array: true })
  rgb: number[];

  @Column({ nullable: false, unique: false })
  type: string;

  @Column({ nullable: false, unique: false })
  lastbought: Date;

  @Column({ nullable: false, unique: false })
  lastshown: Date;

  @Column({ nullable: false, unique: false })
  lastclick: Date;

  @Column({nullable: false, unique: false})
  image_data: string;
}
