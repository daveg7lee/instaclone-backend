import client from '../../client';
import { protectedResolver } from '../../user/user.utils';

export default {
  Query: {
    seeRooms: protectedResolver((_, { lastId }, { loggedInUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
        take: 10,
        skip: lastId && 1,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      })
    ),
  },
};
