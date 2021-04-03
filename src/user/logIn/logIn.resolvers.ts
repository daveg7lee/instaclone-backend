import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Mutation: {
    logIn: async (_, { username, password }) => {
      try {
        // find User with args.username
        const user = await client.user.findFirst({ where: { username } });
        // return Error if user not found
        if (!user) {
          throw new Error('User not found Please Check your username');
        }
        // check password with args.password
        const checkPassword = await bcrypt.compare(password, user.password);
        // return error when password is wrong
        if (!checkPassword) {
          throw new Error('Wrong Password');
        }
        // generate token with user id
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        // return token with success sign
        return {
          success: true,
          token,
        };
      } catch (e) {
        return {
          success: true,
          error: e.message,
        };
      }
    },
  },
};

export default resolvers;
