import client from '../../client';

export default {
  Query: {
    seePhotoComments: (_, { id, offset }) =>
      client.comment.findMany({
        where: { photo: { id } },
        take: 10,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
  },
};
