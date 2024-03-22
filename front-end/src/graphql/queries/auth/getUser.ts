import gql from "graphql-tag";

const GetUser = gql`
  query GetUser {
    getMe {
      id
      firstName
      lastName
      email
      favourites
      isAdmin
    }
  }
`;

export default GetUser;
