import { gql } from "@apollo/client";

export const TOGGLE_FAVORITE_QUERY = gql`
    mutation toggleFavorite($activityId: String!) {
        toggleFavorite(activityId: $activityId) {
            id
            isFavorite
        }
}
`;