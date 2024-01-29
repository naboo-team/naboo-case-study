import gql from "graphql-tag";

const RoleFragment = gql`
  fragment Role on RoleDto {
    id
    name
  }
`;

export default RoleFragment;
