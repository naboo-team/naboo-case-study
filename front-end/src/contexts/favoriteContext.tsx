import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { TOGGLE_FAVORITE_MUTATION } from "@/graphql/mutations/favorite/toggleFavorite";
import { useAuth } from "@/hooks";
import { GET_USER_FAVORITES_ACTIVITIES } from "@/graphql/queries/favorite/checkFavorite";
import { ActivityDto } from "@/graphql/generated/types";

type FavoritesContextType = {
  favorites: ActivityDto[];
  handleToggleFavorite: (
    activityId: string,
    activityData: any
  ) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoriteProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoriteProviderProps) => {
  const [favorites, setFavorites] = useState<ActivityDto[]>([]);

  const auth = useAuth();

  const { data, loading, error } = useQuery(GET_USER_FAVORITES_ACTIVITIES, {
    variables: { userId: auth.user?.id },
    skip: auth.isLoading || !auth.user?.id,
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_MUTATION);

  useEffect(() => {
    if (
      auth.user &&
      !loading &&
      !error &&
      data &&
      data.GetUserFavoriteActivities
    ) {
      setFavorites(data.GetUserFavoriteActivities);
    } else {
      setFavorites([]);
    }
  }, [data, loading, error, auth.user]);

  const handleToggleFavorite = async (
    activityId: string,
    activityData: any
  ) => {
    if (!auth.user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await toggleFavorite({
        variables: {
          createFavoriteInput: {
            userId: auth.user.id,
            activityId,
          },
        },
      });

      setFavorites((prevFavorites) => {
        const isCurrentlyFavorite = prevFavorites.some(
          (fav) => fav.id === activityId
        );
        if (isCurrentlyFavorite) {
          return prevFavorites.filter((fav) => fav.id !== activityId);
        } else {
          const newFavorite = { ...activityData, id: activityId };
          return [...prevFavorites, newFavorite];
        }
      });
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, handleToggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
