import gql from "graphql-tag";

const UnmarkActivityAsFavorite = gql`
  mutation UnmarkActivityAsFavorite(
    $unmarkActivityAsFavoriteInput: UnmarkActivityAsFavoriteInput!
  ) {
    unmarkActivityAsFavorite(
      unmarkActivityAsFavoriteInput: $unmarkActivityAsFavoriteInput
    ) {
      id
      isFavorited
    }
  }
`;

export default UnmarkActivityAsFavorite;
