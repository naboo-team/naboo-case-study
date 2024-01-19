import { ActivityFragment, ToggleFavoriteMutation, ToggleFavoriteMutationVariables } from "@/graphql/generated/types";
import { TOGGLE_FAVORITE_QUERY } from "@/graphql/mutations/activity/toggleFavorite.query";
import GetUser from "@/graphql/queries/auth/getUser";
import { useAuth } from "@/hooks";
import { useDebugMode } from "@/hooks/useDebugMode";
import { useGlobalStyles } from "@/utils";
import { useMutation } from "@apollo/client";
import { Badge, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";

interface ActivityProps {
  activity: ActivityFragment;
}

export function Activity({ activity  }: ActivityProps) {
  const { classes } = useGlobalStyles();
  const { user } = useAuth();
  const [isDebugMode] =  useDebugMode()

  const [toggleFavorite] = useMutation<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>(TOGGLE_FAVORITE_QUERY, { variables: { activityId: activity.id }, optimisticResponse: {
    toggleFavorite: {
      __typename: "ActivityDto",
      id: activity.id,
      isFavorite: !activity.isFavorite,
    },
  }, refetchQueries: [{ query: GetUser }]});

  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://source.unsplash.com/random/?city"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="left" mt="md" mb="xs" dir="row" noWrap >   
         {activity.isFavorite ?  <IconStarFilled onClick={() => user && toggleFavorite()} className={classes.cursorPointer}/> : <IconStar onClick={() => user && toggleFavorite()} className={classes.cursorPointer}/>}
         <Text weight={500} className={classes.ellipsis}>
            {activity.name}
          </Text>
        </Group>

        <Group mt="md" mb="xs">
          <Badge color="pink" variant="light">
            {activity.city}
          </Badge>
          <Badge color="yellow" variant="light">
            {`${activity.price}€/j`}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.description}
        </Text>

        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Voir plus
          </Button>
        </Link>

        {isDebugMode && <Text mt="xs" size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.createdAt}
        </Text>}
      </Card>
    </Grid.Col>
  );
}
