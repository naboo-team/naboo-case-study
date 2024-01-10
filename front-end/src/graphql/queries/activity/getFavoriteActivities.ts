import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetUserFavoriteActivities = gql`
  query getUserFavoriteActivities {
    getUserFavoriteActivities {
      ...Activity
    }
  }
  ${ActivityFragment}
`;

export default GetUserFavoriteActivities;
