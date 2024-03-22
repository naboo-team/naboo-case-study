import { Button, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import React, { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { useHandleAddFavourite } from "@/hooks/useHandleAddFavourite";

interface AddToFavouritesProps {
    activityId: string;
}

export function AddToFavourites(props: AddToFavouritesProps) {
  const user = useContext(UserContext);
  const handleAddFavourite = useHandleAddFavourite(props.activityId);
  const isFavourite = user.favourites.includes(props.activityId);


  return (
    <Button color="blue" fullWidth mt="md" radius="md" onClick={handleAddFavourite}>
      <IconHeart fill={ isFavourite ? "red" : "white"} stroke="none" strokeWidth="0px"/>
      <Text size="sm" ml="sm">
        {isFavourite ? "Remove from favourites" : "Add to favourites"}
      </Text>
    </Button>
  );
}