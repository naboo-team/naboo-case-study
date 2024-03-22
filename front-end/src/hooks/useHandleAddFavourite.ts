import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/authContext';
import { UserContext } from '@/contexts/userContext';

export const useHandleAddFavourite = (activityId: string) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const isLogged = useContext(AuthContext);

  const handleAddFavourite = async () => {
    if (!isLogged.user) {
      router.push("/signup");
      return;
    }
    if (user.favorites.includes(activityId)) {
      user.removeFavorite( activityId);
      user.updateFavorites(user.favorites.filter((fav) => fav !== activityId));
    } else {
      user.addFavorite( activityId);
      user.updateFavorites([...user.favorites, activityId]);
    }
  }

  return handleAddFavourite;
};