import jwt from 'jsonwebtoken';
import client from '../client';
import { Resolver } from '../types';

// get User by id from token
export const getUser = async (token) => {
  try {
    // return null when token is undefined
    if (!token) {
      return null;
    }
    // get id from token
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ('id' in verifiedToken) {
      // get user by id
      const user = client.user.findUnique({
        where: { id: verifiedToken['id'] },
      });
      // return user
      if (user) {
        return user;
      }
    }
    return null;
    // return null when error occur
  } catch {
    return null;
  }
};

// protecting resolver if their are no user(token)
export const protectedResolver = (ourResolver: Resolver) => (
  root,
  args,
  context,
  info
) => {
  const { loggedInUser } = context;
  if (!loggedInUser) {
    const query = info.operation.operation === 'query';
    if (query) {
      return null;
    } else {
      return {
        success: false,
        error: 'Please log in',
      };
    }
  }
  return ourResolver(root, args, context, info);
};

export const checkUsername = (username) =>
  client.user.findUnique({ where: { username }, select: { username: true } });

export const checkEmail = (email) =>
  client.user.findUnique({ where: { email }, select: { email: true } });
