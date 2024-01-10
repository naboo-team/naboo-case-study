import { PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivityQuery,
  GetActivityQueryVariables,
  MarkActivityAsFavoriteMutation,
  MarkActivityAsFavoriteMutationVariables,
} from "@/graphql/generated/types";
import MarkActivityAsFavorite from "@/graphql/mutations/activity/markActivityAsFavorite";
import GetActivity from "@/graphql/queries/activity/getActivity";
import { useMutation } from "@apollo/client";
import { Badge, Button, Flex, Grid, Group, Image, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

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

  const [markActivityAsFavorite] = useMutation<
    MarkActivityAsFavoriteMutation,
    MarkActivityAsFavoriteMutationVariables
  >(MarkActivityAsFavorite);

  const markAsFavorite = useCallback(() => {
    markActivityAsFavorite({
      variables: {
        markActivityAsFavoriteInput: {
          activityId: activity.id,
        },
      },
    })
      .then(() => {
        router.push("/profil");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activity.id, markActivityAsFavorite, router]);

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
            <Button onClick={markAsFavorite}>Favorite</Button>
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
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
}
