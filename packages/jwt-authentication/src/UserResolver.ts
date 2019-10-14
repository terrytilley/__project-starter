import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "./entity/User";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const salt = 12;
    const hashedPassword = await hash(password, salt);

    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }
}
