import client from '../../client';
import { protectedResolver } from '../../user/user.utils';
import { extractHashtags } from '../photos.utils';

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const oldPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });
        if (!oldPhoto) {
          return {
            success: false,
            error: 'Photo not found',
          };
        }
        const hashtagObj = extractHashtags(caption);
        await client.photo.update({
          where: { id },
          data: {
            caption,
            ...(hashtagObj.length > 0 && {
              hashtags: {
                disconnect: oldPhoto.hashtags,
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
        return {
          success: true,
        };
      }
    ),
  },
};
