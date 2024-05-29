import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  tag: string;

  @Column({ nullable: false, unique: false })
  content: string;

  @Column({ nullable: false, unique: false })
  criteria_target: string;

  @Column({ nullable: false, unique: false })
  criteria_application: string;

  @Column({ nullable: false, unique: false })
  user_response_type: string;

  @Column({ nullable: false, unique: false })
  factor: number;

  @Column({ nullable: false, unique: false })
  minimize: boolean;
}
