import gql from "graphql-tag";

const addToFavourites = gql`
    mutation AddFavorite($activityId: String!) {
        addFavorite(activityId: $activityId) {
            email,
            firstName,
            lastName,
            id,
        }
    }
`;

export default addToFavourites;