import { createWriteStream } from 'fs';
import bcrypt from 'bcrypt';
import { protectedResolver, checkEmail, checkUsername } from '../user.utils';
import { Resolvers } from '../../types';
import { deleteInS3, uploadToS3 } from '../../shared/shared.utils';

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, client }
      ) => {
        try {
          let avatarUrl = null;
          if (avatar) {
            loggedInUser.avatar && (await deleteInS3(loggedInUser.avatar));
            avatarUrl = await uploadToS3(avatar, loggedInUser.id, 'avatars');
          }
          // hashing new password if new password exists
          const hashedPassword =
            newPassword && (await bcrypt.hash(newPassword, 10));
          // check username or email is exists
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
          // update User
          const updatedUser = await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              firstName,
              lastName,
              username,
              email,
              bio,
              ...(hashedPassword && { password: hashedPassword }),
              ...(avatarUrl && { avatar: avatarUrl }),
            },
          });
          // return Success or not
          if (updatedUser.id) {
            return {
              success: true,
            };
          } else {
            throw new Error('Could not update profile');
          }
        } catch (e) {
          return {
            success: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
export default resolvers;
