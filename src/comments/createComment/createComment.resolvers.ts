import client from '../../client';
import { protectedResolver } from '../../user/user.utils';

export default {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true,
          },
        });
        if (!photo) {
          return {
            success: false,
            error: 'Photo not Found',
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return {
          success: true,
        };
      }
    ),
  },
};
