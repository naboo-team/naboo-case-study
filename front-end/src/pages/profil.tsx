import { Activity, EmptyData, PageTitle } from "@/components";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Flex, Grid, Text, Title } from "@mantine/core";
import Head from "next/head";
import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivitiesQuery, GetActivitiesQueryVariables,
} from "@/graphql/generated/types";
import GetActivities from "@/graphql/queries/activity/getActivities";

interface ProfileProps {
    activities: GetActivitiesQuery["getActivities"];
}

export const getServerSideProps: GetServerSideProps<
    ProfileProps
> = async ({ req }) => {
  const response = await graphqlClient.query<
        GetActivitiesQuery,
        GetActivitiesQueryVariables
    >({
      query: GetActivities,
      context: { headers: { Cookie: req.headers.cookie } },
    });
  return { props: { activities: response.data.getActivities } };
};

const Profile = ({ activities }: ProfileProps) => {
  const { user } = useAuth();
  const currentUser = useContext(UserContext);
  const favourites = currentUser?.favourites;



  const favouriteActivities = activities.filter((activity) => {
    return favourites?.includes(activity.id);
  });

  return (
    <>
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      <Flex direction="column" gap="md">
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
        <Title order={4}>
            Mes activités favorites
        </Title>
        <Grid>
          {activities.length > 0 ? (
            favouriteActivities.map((activity) => (
              <Activity activity={activity} key={activity.id} />
            ))
          ) : (
            <EmptyData />
          )}
        </Grid>

      </Flex>
    </>
  );
};

export default withAuth(Profile);
