import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

export const GET_USER_FAVORITES_ACTIVITIES = gql`
  query GetUserFavoriteActivities($userId: String!) {
    GetUserFavoriteActivities(userId: $userId) {
      ...Activity
    }
  }
  ${ActivityFragment}
`;
