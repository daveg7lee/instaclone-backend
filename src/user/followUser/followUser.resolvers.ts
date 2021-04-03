import { Resolvers } from "../../types";
import { protectedResolver, checkUsername } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const ok = await checkUsername(username);
          if (!ok) {
            throw new Error("User not found Check username is correct");
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
          return {
            success: true,
          };
        } catch (e) {
          return {
            success: false,
            error: e.message,
          };
        }
      }
    ),
  },
};

export default resolvers;
