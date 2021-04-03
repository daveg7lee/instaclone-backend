import client from '../../client';

export default {
  Query: {
    seePhotoComments: (_, { id, lastId }) =>
      client.comment.findMany({
        where: { photo: { id } },
        take: 10,
        skip: lastId && 1,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
        orderBy: {
          createdAt: 'desc',
        },
      }),
  },
};
