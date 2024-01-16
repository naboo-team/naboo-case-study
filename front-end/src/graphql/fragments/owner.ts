import gql from "graphql-tag";

const OwnerFragment = gql`
  fragment Owner on User {
    firstName
    lastName
  }
`;

export default OwnerFragment;
