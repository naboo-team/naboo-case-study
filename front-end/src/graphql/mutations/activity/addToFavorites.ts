import gql from "graphql-tag";

const addToFavorites = gql`
    mutation AddFavorite($activityId: String!) {
        addFavorite(activityId: $activityId) {
            email,
            firstName,
            lastName,
            id,
        }
    }
`;

export default addToFavorites;