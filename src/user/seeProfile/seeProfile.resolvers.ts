import client from '../../client';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: { username },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};

export default resolvers;
