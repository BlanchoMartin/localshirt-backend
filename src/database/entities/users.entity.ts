import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: false })
  name: string;

  @Column({ nullable: false, unique: false })
  lastName: string;

  @Column({ nullable: false, unique: false })
  businessRole: string;

  @Column({ nullable: false, unique: false })
  businessContact: string;

  @Column({ type: 'bytea', nullable: true })
  business_logo: Buffer;

  @Column({ type: 'bytea', nullable: true })
  profil_picture: Buffer;

  @Column({ nullable: false, unique: false })
  businessName: string;

  @Column({ nullable: true, unique: false })
  businessDescription: string;

  @Column({ nullable: true, unique: false })
  businessAdress: string;

  @Column({ nullable: true, unique: false })
  businessZipCode: string;

  @Column({ nullable: true, unique: false })
  businessCity: string;

  @Column({ nullable: true, unique: false })
  businessCountry: string;

  @Column({ nullable: false, unique: false })
  businessLink: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ default: false })
  isDeveloper: boolean;


  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ nullable: false, default: false })
  resetPassword: boolean;

  @Column({nullable: true})
  resetPasswordReference: string
}
