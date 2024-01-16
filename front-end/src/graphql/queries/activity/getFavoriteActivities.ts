import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetUserFavoriteActivities = gql`
  query getUserFavoriteActivities {
    getMe {
      favoriteActivities {
        ...Activity
      }
    }
  }
  ${ActivityFragment}
`;

export default GetUserFavoriteActivities;
