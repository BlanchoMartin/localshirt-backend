import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Criteria {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  tag: string;

  @Column({ nullable: false, unique: false })
  type: string;

  @Column({ nullable: false, unique: false })
  additionalCriteria: string;

  @Column({ nullable: false, unique: false })
  ethical_score: number;

  @Column({ nullable: false, unique: false })
  ecological_score: number;

  @Column({ nullable: false, unique: false })
  local_score: number;
}
