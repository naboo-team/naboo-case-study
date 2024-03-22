import { PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivityQuery,
  GetActivityQueryVariables
} from "@/graphql/generated/types";
import GetActivity from "@/graphql/queries/activity/getActivity";
import {Badge, Flex, Grid, Group, Image, Text} from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import {AddToFavourites} from "@/components/Buttons/AddToFavourites";

interface ActivityDetailsProps {
  activity: GetActivityQuery["getActivity"];
}

export const getServerSideProps: GetServerSideProps<
  ActivityDetailsProps
> = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) return { notFound: true };
  const response = await graphqlClient.query<
    GetActivityQuery,
    GetActivityQueryVariables
  >({
    query: GetActivity,
    variables: { id: params.id },
  });
  return { props: { activity: response.data.getActivity } };
};


export default function ActivityDetails({ activity }: ActivityDetailsProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{activity.name} | CDTR</title>
      </Head>
      <PageTitle title={activity.name} prevPath={router.back} />
      <Grid>
        <Grid.Col span={7}>
          <Image
            src="https://source.unsplash.com/random/?city"
            radius="md"
            alt="random image of city"
            width="100%"
            height="400"
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <Flex direction="column" gap="md">
            <Group mt="md" mb="xs">
              <Badge color="pink" variant="light">
                {activity.city}
              </Badge>
              <Badge color="yellow" variant="light">
                {`${activity.price}€/j`}
              </Badge>
            </Group>
            <Text size="sm">{activity.description}</Text>
            <Text size="sm" color="dimmed">
              Ajouté par {activity.owner.firstName} {activity.owner.lastName}
            </Text>
            <Text size="sm" color="dimmed">
              Créé le { new Date(activity.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }
            </Text>
            <AddToFavourites activityId={activity.id} />
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
}
