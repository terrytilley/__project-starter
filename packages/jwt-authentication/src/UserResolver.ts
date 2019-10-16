import {
  Arg,
  Ctx,
  Query,
  Field,
  Mutation,
  Resolver,
  ObjectType,
  UseMiddleware
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "./entity/User";
import { isAuth } from "./isAuth";
import { MyContext } from "./MyContext";
import { sendRefreshToken } from "./sendRefreshToken";
import { createRefreshToken, createAccessToken } from "./auth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Example of auth middleware in use
  @Query(() => String)
  @UseMiddleware(isAuth)
  protected(@Ctx() { payload }: MyContext) {
    return `userId: ${payload!.userId}`;
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Bad password");
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));
    return {
      accessToken: createAccessToken(user)
    };
  }
}
