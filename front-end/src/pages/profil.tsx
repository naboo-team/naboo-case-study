import { ActivityListItem, PageTitle } from "@/components";
import { ReorderableList } from "@/components/ReorderableList";
import { GetFavoritesQuery, GetFavoritesQueryVariables, SetFavoritesMutation, SetFavoritesMutationVariables } from "@/graphql/generated/types";
import { SET_FAVORITES_MUTATION } from "@/graphql/mutations/me/setFavorites.query";
import { GET_FAVORITES_QUERY } from "@/graphql/queries/activity/getFavorites";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import { Avatar, Flex, Group, Text } from "@mantine/core";
import Head from "next/head";

const Profile = () => {
  const { user } = useAuth();

  const { data } = useQuery<GetFavoritesQuery, GetFavoritesQueryVariables>(GET_FAVORITES_QUERY);
  const [setFavorite] = useMutation<SetFavoritesMutation, SetFavoritesMutationVariables>(SET_FAVORITES_MUTATION);
  const favorites = data?.getMe.favorites || [];
  return (
    <>
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      <Flex align="center" gap="md">
        <Avatar color="cyan" radius="xl" size="lg">
          {user?.firstName[0]}
          {user?.lastName[0]}
        </Avatar>
        <Flex direction="column">
          <Text>{user?.email}</Text>
          <Text>{user?.firstName}</Text>
          <Text>{user?.lastName}</Text>
        </Flex>
      </Flex>

      <h3>Mes favoris</h3>
      <Flex align="start">
        {
          favorites.length > 0 ? (
            <ReorderableList
            elements={favorites.map((activity) => ({
              key: activity.id,
              node:  <ActivityListItem activity={activity} />
            }))}
            onReorder={(elements) => {
              setFavorite({
                variables: {
                  favorites: elements.map((element) => element.key)
                },
                // refetchQueries: [{ query: GET_FAVORITES_QUERY }],
                optimisticResponse: {
                  __typename: "Mutation",
                  setFavorites: {
                    __typename: "UserDto",
                    id: user!.id,
                    favorites: elements.map((element) => ({ id : element.key, __typename: "ActivityDto" }))
                  }
                }
              })
            } } 
            />
          ) : (
            <Text>Vous n&apos;avez pas encore de favoris</Text>
            )
        }
      </Flex>
    </>
  );
};

export default withAuth(Profile);
