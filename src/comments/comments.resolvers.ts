import client from '../client';

export default {
  Comment: {
    user: ({ id }) => client.comment.findUnique({ where: { id } }).user(),
    photo: ({ id }) => client.comment.findUnique({ where: { id } }).photo(),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};
