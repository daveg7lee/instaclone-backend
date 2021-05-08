import client from '../../client';
import { protectedResolver } from '../../user/user.utils';

export default {
  Query: {
    seeFeed: protectedResolver((_, { offset }, { loggedInUser }) => {
      return client.photo.findMany({
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
        take: 4,
        skip: offset,
      });
    }),
  },
};
