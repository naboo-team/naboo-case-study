import { Activity, EmptyData, PageTitle } from "@/components";
import { withApolloClient } from "@/graphql/apollo";
import {
  GetActivitiesQuery,
  GetActivitiesQueryVariables,
} from "@/graphql/generated/types";
import GetActivities from "@/graphql/queries/activity/getActivities";
import { useAuth } from "@/hooks";
import { useQuery } from "@apollo/client";
import { Button, Grid, Group } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";


export const getServerSideProps: GetServerSideProps<
  {initialApolloState: GetActivitiesQuery["getActivities"]}
> = withApolloClient(async (client) => {
  const response = await client.query<
  GetActivitiesQuery,
  GetActivitiesQueryVariables
  >({
    query: GetActivities,
  });


  return { props: { initialApolloState: response.data.getActivities } }
})

export default function Discover() {
  const { user } = useAuth();
  const { data } = useQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(
    GetActivities
  );
  const activities = data?.getActivities || [];

  return (
    <>
      <Head>
        <title>Discover | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Découvrez des activités" />
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
}
