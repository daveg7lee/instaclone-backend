import bcrypt from 'bcrypt';
import client from '../../client';
import { Resolvers } from '../../types';
import { checkEmail, checkUsername } from '../user.utils';

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // Check Username or Email is already taken
        const existingUsername = username && (await checkUsername(username));
        const existingEmail = email && (await checkEmail(email));
        if (existingEmail || existingUsername) {
          throw new Error(
            existingEmail && existingUsername
              ? 'Username and Email is already taken'
              : existingUsername
              ? 'Username is already taken'
              : 'Email is already taken'
          );
        }
        // hashing password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        // create User
        await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
          },
        });
        // return User with ok
        return {
          success: true,
        };
      } catch (e) {
        return {
          success: false,
          error: e.message,
        };
      }
    },
  },
};

export default resolvers;
