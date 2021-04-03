import client from "../../client";

export default {
  Query: {
    searchPhotos: (_, { keyword, lastId }) =>
      client.photo.findMany({
        where: { caption: { startsWith: keyword } },
        take: 10,
        skip: lastId && 1,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
        orderBy: {
          createdAt: "asc",
        },
      }),
  },
};
