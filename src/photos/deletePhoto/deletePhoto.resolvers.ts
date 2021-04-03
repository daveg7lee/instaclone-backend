import client from '../../client';
import { deleteInS3 } from '../../shared/shared.utils';
import { protectedResolver } from '../../user/user.utils';

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
          file: true,
        },
      });
      if (!photo) {
        return {
          success: false,
          error: 'Photo not Found',
        };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          success: false,
          error: 'Not authorized',
        };
      } else {
        await client.comment.deleteMany({
          where: {
            photoId: id,
          },
        });
        await client.like.deleteMany({
          where: {
            photoId: id,
          },
        });
        await client.photo.delete({
          where: {
            id,
          },
        });
        await deleteInS3(photo.file);
        return {
          success: true,
        };
      }
    }),
  },
};
