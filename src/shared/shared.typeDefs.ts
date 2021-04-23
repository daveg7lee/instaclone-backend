import { gql } from 'apollo-server-core';

export default gql`
  type MutationResponse {
    success: Boolean!
    error: String
    token: String
    id: Int
  }
`;
