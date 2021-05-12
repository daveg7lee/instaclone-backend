import client from '../client';

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, { offset }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        take: 20,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            roomId: id,
            read: false,
            user: {
              id: {
                not: loggedInUser.id,
              },
            },
          },
        });
      }
    },
  },
  Message: {
    user: ({ id }) =>
      client.message
        .findUnique({
          where: {
            id,
          },
        })
        .user(),
  },
};
