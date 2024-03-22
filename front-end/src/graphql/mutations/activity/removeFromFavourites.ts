import gql from "graphql-tag";

const removeFromFavorites = gql`
    mutation RemoveFavorite($activityId: String!) {
        removeFavorite(activityId: $activityId) {
            email,
            firstName,
            lastName,
            id,
        }
    }
`;

export default removeFromFavorites;