import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './authContext';
import { useMutation } from '@apollo/client';
import AddToFavourites from '@/graphql/mutations/activity/addToFavourites';
import RemoveFromFavourites from '@/graphql/mutations/activity/removeFromFavourites';
import { useSnackbar } from "@/hooks";

interface UserContextType {
  isAdmin?: boolean;
  favourites: string[];
  updateFavourites: (favorites: string[]) => void;
  addFavourite: (favoriteId: string) => void;
  removeFavourite: (favoriteId: string) => void;
}

export const UserContext = createContext<UserContextType>({
  isAdmin: false,
  favourites: [],
  updateFavourites: () => {},
  addFavourite: () => {},
  removeFavourite: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const { user } = useContext(AuthContext);
  const snackbar = useSnackbar();
  const [addFavouriteMutation] = useMutation(AddToFavourites);
  const [removeFavouriteMutation] = useMutation(RemoveFromFavourites);

  useEffect(() => {
    if (user && user.favourites) {
      setFavourites(user.favourites);
    }
  }, [user]);

  const updateFavourites = (newFavourites: string[]) => {
    setFavourites(newFavourites);
  };

  const addFavourite = async (favouriteId: string) => {
    try {
      await addFavouriteMutation({ variables: { activityId: favouriteId } });
      updateFavourites([...favourites, favouriteId]);
      snackbar.success('Activité ajoutée aux favoris');
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavourite = async (favouriteId: string) => {
    try {
      await removeFavouriteMutation({ variables: { activityId: favouriteId } });
      updateFavourites(favourites.filter(id => id !== favouriteId));
      snackbar.success('Activité retirée des favoris');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider value={{ favourites, updateFavourites, addFavourite, removeFavourite }}>
      {children}
    </UserContext.Provider>
  );
};