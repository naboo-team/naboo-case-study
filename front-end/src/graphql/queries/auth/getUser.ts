import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetUser = gql`
  query GetUser {
    getMe {
      id
      firstName
      lastName
      email
      favorites {
        ...Activity
      }
    }
  } 
  ${ActivityFragment}
`;

export default GetUser;
