import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './authContext';
import { useMutation } from '@apollo/client';
import AddToFavorites from '@/graphql/mutations/activity/addToFavorites';
import RemoveFromFavourites from '@/graphql/mutations/activity/removeFromFavourites';
import {useSnackbar} from "@/hooks";

interface UserContextType {
  favorites: string[];
  updateFavorites: (favorites: string[]) => void;
  addFavorite: (favoriteId: string) => void;
  removeFavorite: (favoriteId: string) => void;
}

export const UserContext = createContext<UserContextType>({
  favorites: [],
  updateFavorites: () => {},
  addFavorite: () => {},
  removeFavorite: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useContext(AuthContext);
  const snackbar = useSnackbar();
  const [addFavoriteMutation] = useMutation(AddToFavorites);
  const [removeFavoriteMutation] = useMutation(RemoveFromFavourites);

  useEffect(() => {
    if (user && user.favorites) {
      setFavorites(user.favorites);
    }
  }, [user]);

  const updateFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
  };

  const addFavorite = async (favoriteId: string) => {
    try {
      await addFavoriteMutation({ variables: { activityId: favoriteId } });
      updateFavorites([...favorites, favoriteId]);
      snackbar.success('Activité ajoutée aux favoris');
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await removeFavoriteMutation({ variables: { activityId: favoriteId } });
      updateFavorites(favorites.filter(id => id !== favoriteId));
      snackbar.success('Activité retirée des favoris');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider value={{ favorites, updateFavorites, addFavorite, removeFavorite }}>
      {children}
    </UserContext.Provider>
  );
};