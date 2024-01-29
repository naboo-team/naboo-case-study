import gql from "graphql-tag";

export const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($createFavoriteInput: CreateFavoriteInput!) {
    toggleFavorite(createFavoriteInput: $createFavoriteInput)
  }
`;
