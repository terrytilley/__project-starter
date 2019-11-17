import { compare, hash } from 'bcryptjs';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  public static async hashPassword(password: string, salt: number = 12): Promise<string> {
    return hash(password, salt);
  }

  public static async comparePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'boolean', default: false })
  locked: boolean;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field(() => Date)
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await User.hashPassword(this.password);
  }
}
