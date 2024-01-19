import { gql } from "@apollo/client";

export const SET_FAVORITES_MUTATION = gql`
   mutation setFavorites($favorites: [String!]!) {
  setFavorites(setFavoritesInput: {activitiesIds: $favorites}){
    id
    favorites {
        id
    }
  }
}
`;