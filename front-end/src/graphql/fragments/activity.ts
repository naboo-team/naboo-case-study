import gql from "graphql-tag";
import OwnerFragment from "./owner";

const ActivityFragment = gql`
  fragment Activity on Activity {
    id
    city
    description
    name
    price
    isFavorited
    owner {
      ...Owner
    }
  }
  ${OwnerFragment}
`;

export default ActivityFragment;
