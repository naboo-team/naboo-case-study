import gql from "graphql-tag";

const MarkActivityAsFavorite = gql`
  mutation MarkActivityAsFavorite(
    $markActivityAsFavoriteInput: MarkActivityAsFavoriteInput!
  ) {
    markActivityAsFavorite(
      markActivityAsFavoriteInput: $markActivityAsFavoriteInput
    ) {
      id
      isFavorited
    }
  }
`;

export default MarkActivityAsFavorite;
