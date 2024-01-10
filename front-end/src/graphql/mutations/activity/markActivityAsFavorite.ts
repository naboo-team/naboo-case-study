import gql from "graphql-tag";

const MarkActivityAsFavorite = gql`
  mutation MarkActivityAsFavorite(
    $markActivityAsFavoriteInput: MarkActivityAsFavoriteInput!
  ) {
    markActivityAsFavorite(
      markActivityAsFavoriteInput: $markActivityAsFavoriteInput
    )
  }
`;

export default MarkActivityAsFavorite;
