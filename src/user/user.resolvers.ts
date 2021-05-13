import client from '../client';

export default {
  User: {
    totalFollowers: ({ id }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    totalFollowing: ({ id }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalPosts: ({ id }) => client.photo.count({ where: { userId: id } }),
    isMe: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      if (id === loggedInUser.id) {
        return false;
      }
      const exists = await client.user.count({
        where: { username: loggedInUser.username, following: { some: { id } } },
      });
      return Boolean(exists);
    },
    photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
  },
};
