import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    logIn(username: String!, password: String!): MutationResponse!
  }
`;
