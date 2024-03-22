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
    if (user.favourites.includes(activityId)) {
      user.removeFavourite( activityId);
      user.updateFavourites(user.favourites.filter((fav) => fav !== activityId));
    } else {
      user.addFavourite( activityId);
      user.updateFavourites([...user.favourites, activityId]);
    }
  }

  return handleAddFavourite;
};