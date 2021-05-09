import client from '../../client';

export default {
  Query: {
    searchPhotos: (_, { keyword, offset }) =>
      client.photo.findMany({
        where: { caption: { contains: keyword } },
        take: 10,
        skip: offset,
        orderBy: {
          createdAt: 'asc',
        },
      }),
  },
};
