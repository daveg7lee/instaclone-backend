import client from '../client';

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    commentNumbers: ({ id }) =>
      client.comment.count({ where: { photoId: id } }),
    comments: ({ id }) => client.photo.findUnique({ where: { id } }).comments(),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: { photoId_userId: { userId: loggedInUser.id, photoId: id } },
        select: { id: true },
      });
      return Boolean(ok);
    },
  },
  Hashtag: {
    photos: ({ id }, { lastId }) => {
      return client.hashtag.findUnique({ where: { id } }).photos({
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: { id },
          },
        },
      }),
  },
};
