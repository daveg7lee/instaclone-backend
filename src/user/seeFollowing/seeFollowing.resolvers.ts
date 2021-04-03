import { Resolvers } from "../../types";
import { checkUsername } from "../user.utils";

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      try {
        const existsUser = checkUsername(username);
        if (!existsUser) {
          throw new Error("User not found. Check username again");
        }
        const following = await client.user
          .findUnique({ where: { username } })
          .following({
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
          });
        return {
          success: true,
          following,
        };
      } catch (e) {
        return {
          success: false,
          error: e.message,
        };
      }
    },
  },
};

export default resolvers;
