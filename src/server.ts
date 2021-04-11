require('dotenv').config();
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { ApolloServer, Request } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './user/user.utils';

interface tokenType {
  token: string;
}

// get port number from .env
const PORT = process.env.PORT;
// create apollo server
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
  context: async ({ req, connection }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    } else {
      const { context } = connection;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }: tokenType) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
});

// create express server
const app: any = express();
app.use(logger('tiny'));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

// starting server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/graphql ✅`);
});
