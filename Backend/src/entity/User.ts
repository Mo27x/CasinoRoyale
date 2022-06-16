import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Friendship } from "./Friendship";
import { Token } from "./Token";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  money: number;

  @Column({ nullable: true })
  streak: number;

  @Column({ nullable: true })
  lastAccess: Date;

  @OneToMany(() => Friendship, (Friendship) => Friendship.asker)
  requests: Friendship[];

  @OneToMany(() => Friendship, (Friendship) => Friendship.answerer)
  responses: Friendship[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
