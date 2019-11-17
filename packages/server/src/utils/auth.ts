import { sign } from 'jsonwebtoken';
import { User } from '../entity/User';

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};

export const passwordResetToken = ({ id, password, createdAt }: User) => {
  const secret = `${password}-${createdAt}`;
  const token = sign({ userId: id }, secret, {
    expiresIn: 3600, // 1 hour
  });

  return token;
};

export const passwordResetUrl = ({ id }: User, token: string) =>
  `${process.env.FRONTEND_URL}/password/reset/${id}/${token}`;
