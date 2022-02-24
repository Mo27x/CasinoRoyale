import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  token: string;

  @Column()
  public expiresOn: Date;

  @ManyToOne((type) => User, (user) => user.tokens)
  user: User;
}
