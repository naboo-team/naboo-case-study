import gql from "graphql-tag";
import RoleFragment from "./role";

const OwnerFragment = gql`
  fragment Owner on UserDto {
    firstName
    lastName
    role {
      ...Role
    }
  }
  ${RoleFragment}
`;

export default OwnerFragment;
