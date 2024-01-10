import { FavoriteActivity } from '../types/favoriteActivities';

export function sortFavoriteActivities(
  a: FavoriteActivity,
  b: FavoriteActivity,
) {
  return a.position - b.position;
}
