import client from '../../client';
import { protectedResolver } from '../../user/user.utils';

export default {
  Mutation: {
    deleteComment: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const comment = await client.comment.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });
      if (!comment) {
        return {
          success: false,
          error: 'Comment not found',
        };
      } else if (comment.userId !== loggedInUser.id) {
        return {
          success: false,
          error: 'not authorized',
        };
      } else {
        await client.comment.delete({
          where: {
            id,
          },
        });
        return {
          success: true,
        };
      }
    }),
  },
};
