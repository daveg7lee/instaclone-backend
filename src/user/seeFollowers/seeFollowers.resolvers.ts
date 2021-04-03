import { Resolvers } from "../../types";
import { checkUsername } from "../user.utils";

const TAKE_NUM = 5;

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
      try {
        const userexists = await checkUsername(username);
        if (!userexists) {
          throw new Error("User not found. Check username again");
        }
        const followers = await client.user
          .findUnique({ where: { username } })
          .followers({
            take: TAKE_NUM,
            skip: (page - 1) * TAKE_NUM,
          });
        const totalFollowers = await client.user.count({
          where: { following: { some: { username } } },
        });
        const totalPages = Math.ceil(totalFollowers / TAKE_NUM);
        return {
          success: true,
          followers,
          totalPages,
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
