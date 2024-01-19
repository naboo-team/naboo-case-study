import ActivityFragment from "@/graphql/fragments/activity";
import { gql } from "@apollo/client";

export const GET_FAVORITES_QUERY = gql`
    query getFavorites{
        getMe {
        favorites {
            ...Activity
        }
    }
    }
    ${ActivityFragment}
    `;