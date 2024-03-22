import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Badge, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import Link from "next/link";
import {useHandleAddFavourite} from "@/hooks/useHandleAddFavourite";
import {UserContext} from "@/contexts/userContext";
import {useContext} from "react";
import {AuthContext} from "@/contexts";
import {IconHeart} from "@tabler/icons-react";

interface ActivityProps {
  activity: ActivityFragment;
}

export function Activity({ activity }: ActivityProps) {
  const { classes } = useGlobalStyles();
  const handleAddFavourite = useHandleAddFavourite(activity.id);
  const user = useContext(UserContext);
  const isLogged = useContext(AuthContext);

  const isFavorite = user.favorites.includes(activity.id) ? "red" : "white";

  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          {isLogged.user &&
            <IconHeart
              className={classes.heartIcon}
              style={{fill: isFavorite}}
              onClick={handleAddFavourite}
            />
          }
          <Image
            src="https://source.unsplash.com/random/?city"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
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
      </Card>
    </Grid.Col>
  );
}
