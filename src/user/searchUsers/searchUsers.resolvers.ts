import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { term, lastId }, { client }) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: term.toLowerCase(),
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};

export default resolvers;
