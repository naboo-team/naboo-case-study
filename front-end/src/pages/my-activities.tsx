import { Activity, EmptyData, PageTitle } from "@/components";
import { withApolloClient } from "@/graphql/apollo";
import {
  GetUserActivitiesQuery,
  GetUserActivitiesQueryVariables,
} from "@/graphql/generated/types";
import GetUserActivities from "@/graphql/queries/activity/getUserActivities";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { useQuery } from "@apollo/client";
import { Button, Grid, Group } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<
  {}
> = withApolloClient(async (client) => {
  const response = await client.query<
    GetUserActivitiesQuery,
    GetUserActivitiesQueryVariables
  >({
    query: GetUserActivities,
  });
  return  { props: { activities: response.data.getActivitiesByUser } };
})

const MyActivities = () => {
  const { user } = useAuth();
  const { data } = useQuery<GetUserActivitiesQuery, GetUserActivitiesQueryVariables>(
    GetUserActivities
  );
  const activities = data?.getActivitiesByUser || [];


  return (
    <>
      <Head>
        <title>Mes activités | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Mes activités" />
        {user && (
          <Link href="/activities/create">
            <Button>Ajouter une activité</Button>
          </Link>
        )}
      </Group>
      <Grid>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Activity activity={activity} key={activity.id} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
    </>
  );
};

export default withAuth(MyActivities);
