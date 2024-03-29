import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Friendship {
  @Column({ nullable: true })
  areFriended: boolean;

  @Column({ nullable: true })
  isBlocked: boolean;

  @ManyToOne(() => User, (user) => user.requests, { primary: true })
  asker: User;

  @ManyToOne(() => User, (user) => user.responses, { primary: true })
  answerer: User;
}
