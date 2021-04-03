import { uploadToS3 } from '../../shared/shared.utils';
import { protectedResolver } from '../../user/user.utils';
import { extractHashtags } from '../photos.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser, client }) => {
        let hashtagObj = [];
        if (caption) {
          hashtagObj = extractHashtags(caption);
        }
        const fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');
        return client.photo.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            file: fileUrl,
            caption,
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
    ),
  },
};
