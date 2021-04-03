import client from '../../client';
import { protectedResolver } from '../../user/user.utils';

export default {
  Query: {
    seeFeed: protectedResolver((_, { lastId }, { loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: lastId && 1,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      })
    ),
  },
};
