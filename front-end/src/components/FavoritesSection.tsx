import React from "react";
import { useFavorites } from "@/contexts/favoriteContext";
import { Activity, EmptyData } from "@/components";
import { Grid } from "@mantine/core";

const FavoritesSection = () => {
  const { favorites } = useFavorites();

  return (
    <div>
      <h2>Mes activités favorites</h2>
      <Grid>
        {favorites.length > 0 ? (
          favorites.map((activity) => (
            <Activity activity={activity} key={activity.id} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
    </div>
  );
};

export default FavoritesSection;
