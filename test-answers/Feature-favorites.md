# Feature 1 - Favorites

## Request
Add a "favorites" feature. The user can : 

* Add an activity as a favorite
* Look at the list of their favorites on their profile
* Order their favorites list

## Analysis

### What's already there
* We've already got a `profil` page where a user's information is displayed
* Activities already exist separately from the user

What would make the most sense would be to create an "association table" of sorts that ties a user's activities selection to their profile.

### What needs to be done

1. Give an action to the user so they can mark an activity as "favorite"
2. Display the list of all actions they marked as such
3. In their profile page, display the list
4. Provide a way to re-order that list (drag and drop)

### Technical analysis

#### Update the `User` model to add a `favorites` field that will hold an ordered list of their favorites
* We could go for a more classical relational approach by creating an association collection, but it seems a bit overkill, and not quite in the spirit of a document oriented DB like Mongo
* Storing the favorites list as an ordered list makes the display relatively trivial since we'd "just" have to load the list and display it.
* We could run in some limitations with the simple `favorites` field stored that way, but the tradeoffs seem acceptable:
  * Since there is a limitation in size for Mongo documents (16MiB) we typically do not want the document to keep on growing indefinitely, but it seems unlikely in our case, as a user would need to add thousands of favorites for the issue to appear.
  * There is also the issue of sending a relatively large payload (which will happen earlier) should the user manipulate a huge list of favorites, but if we're only manipulating a list of ids we'll encounter the same issue (i.e: our user is unlikely to have that many favorites)
  * If we're worried about this, we could immediately implement a hard favorites limit, which would
    * make sense "business logic wise" : a user can only have so many favorites, fixing a limit would push them to choose, well, their actual favorite activities
    * de facto take care of the technical limitations mentioned earlier (keep our document size growth under control & ensure we are not sending MiBs worth of "favorite activities" update payloads)

#### Update the GraphQL configuration to add new operations (3 mutations, 1 query)

##### Mutations

| Name | Signature | Auth | Description |
|---|---|---|---|
| `addFavorite` | `addFavorite(activityId: ID!): User!` | Required | Appends `activityId` to the end of the user's `favorites` array if not already present. Returns the updated `User`. |
| `removeFavorite` | `removeFavorite(activityId: ID!): User!` | Required | Removes `activityId` from the `favorites` array. Returns the updated `User`. |
| `reorderFavorites` | `reorderFavorites(orderedIds: [ID!]!): User!` | Required | Replaces the user's `favorites` array with the provided `orderedIds`. The client sends the full new order after a drag-drop release. Returns the updated `User`. |

`reorderFavorites` design rationale : it is simpler to replace the whole array in one go to update the ordering. But would have to be updated to manipulate the array in place if we were to handle queries where the list would actually be sizeable (i.e: several MiB) as :
* We don't want that kind of traffic to just change the ordering of a few elements in a list
* If, for any reason, such an event was to occur, we want a stopgap before

##### Query

| Name | Signature | Auth | Description                                                                                                                                                                                                   |
|---|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `getMyFavorites` | `getMyFavorites: [Activity!]!` | Required | Returns the authenticated user's favorite activities, **ordered by the `favorites` array position** (rank). It should use `findByIds` (pre-existing method, unused before) to fetch corresponding activities. |

**`findByIds` activation**: `ActivityService.findByIds(ids: string[])` (currently dead code at `activity.service.ts:35–37`) looks like the right method for this query. It takes an array of IDs and returns the matching activities.
The critical addition is: the results must be returned in the same order as the input IDs in order for the front to just have to display the list.
This can be done by updating `findByIds` to enforce order (basically re-order the results from the database based on the order of the elements in the array used as an input to the `$in` clause).

#### Prepare the front-end app to query & display the new `favorites` section

We don't necessarily want to re-invent the wheel and libs like `dnd` should do the job nicely when it comes to display and, more importantly, re-position elements of a list to sort them. We could leverage https://dndkit.com/react/hooks/use-sortable/ that seems fit for our purpose.
Since Mantine does not ship any drag-and-drop primitives of its own, bare dnd should get us what we want without too many additional dependencies, a somewhat standard look and feel, and the peace of mind of not having to implement it ourselves, maybe with some inspiration from https://ui.mantine.dev/category/dnd/

We probably want a dedicated `FavoritesList` component that'll contain the list (easier to test, move around, add to tools like StoryBook...) that we'll integrate in the `Profile` component.


#### Ensuring the front-end list gets correctly updated

After we've run our mutations and gotten a result, we still need to ensure that the `Profile` re-renders well.
Since `User.favorites` is just an ordered list of references to Activities, we need to reconcile that data in the UI at some point so that `FavoritesList` can render with the right, ordered, list of activities.

That leaves us with essentially 2 options : 
* Pure UI : rebuild the favorite activities list by combining the user favorites list returned by our mutation (to get the ordered list of favorites) and the already cached list of activities (pure activity data) -> This saves us a network call, at the cost of a little more code an some logic duplicated between the back and front apps
* refetch `GetMyFavorites` : through Apollo's `refetchQueries` we can leverage the same logic (that is already implemented on the back-end side) -> We avoid duplication, but at the cost of an additional network call

I'd personally choose the second option (`refetchQueries`), just because the app as a whole should not be very "network intensive", per se, and I would rank a logic bug introduced by duplicated logic being incorrectly maintained down the road (e.g: client logic gets updated but not the backend) more likely to cause issues. Re-query-ing addresses those concerns.

### Source code updates (indicative)

#### Back-End: File Changes

| File | Change                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/user/user.schema.ts` | Add `@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]) favorites: ObjectId[]` with `@Field(() => [Activity])` decorator                                                                                                                                                                                                                                                                                                        |
| `src/user/user.service.ts` | Add `addFavorite(userId, activityId)`, `removeFavorite(userId, activityId)`, `reorderFavorites(userId, orderedIds)` methods using `findByIdAndUpdate` with `$addToSet` / `$pull` / direct array replacement. `addFavorite` and `reorderFavorites` mutations should perform checks to ensure the activities to be added do exist. `removeFavorite` should have no effect if the target activityId is not present in the user's list of favorites |
| `src/activity/activity.service.ts` | Activate and fix `findByIds` to preserve input order (sort results to match ID array order after fetching)                                                                                                                                                                                                                                                                                                                                      |
| `src/activity/activity.resolver.ts` | Add `@ResolveField isFavorited` that checks the current user's favorites (requires reading `jwtPayload` from context — only resolved when the user is authenticated)                                                                                                                                                                                                                                                                            |
| `src/favorite/` (new module) | New `FavoriteModule`, `FavoriteResolver`, `FavoriteService` — or alternatively, add the three mutations directly to a new resolver inside `UserModule` to keep the module boundary clean. The `FavoriteResolver` is preferred to avoid bloating `UserResolver`.                                                                                                                                                                                 |
| `src/favorite/favorite.resolver.ts` | `@UseGuards(AuthGuard)` on all three mutations; `getMyFavorites` query resolver calling `ActivityService.findByIds` with the user's ordered `favorites` array                                                                                                                                                                                                                                                                                   |
| `src/favorite/favorite.inputs.dto.ts` | `@InputType() ReorderFavoritesInput { orderedIds: string[] }` with `@IsArray()` and `@IsMongoId({ each: true })` validation                                                                                                                                                                                                                                                                                                                     |
| `src/app.module.ts` (`BaseAppModule`) | Import `FavoriteModule`                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### Front-End: File Changes

| File                                                 | Change                                                                                                                                                                                                                                                                                                                                                                        |
|------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/pages/profil.tsx`                               | Complete the existing stub: add `getServerSideProps` to fetch `getMyFavorites` (with cookie forwarding), pass `favoriteActivities` as props, render the `FavoritesList` component. Can use it as an opportunity to remove the dead `graphqlClient` and `GetServerSideProps` imports & rename the file to `profile.tsx`                                                        |
| `src/graphql/mutations/favorite/addFavorite.ts`      | New file — `AddFavorite` mutation that takes an activityId and adds it from the current user's list of favorites                                                                                                                                                                                                                                                              |
| `src/graphql/mutations/favorite/removeFavorite.ts`   | New file — `RemoveFavorite` mutation that takes an activityId and removes it from the current user's list of favorites                                                                                                                                                                                                                                                        |
| `src/graphql/mutations/favorite/reorderFavorites.ts` | New file — `ReorderFavorites` mutation that takes an ordered list of favorites and updates the current user's list of favorites                                                                                                                                                                                                                                               |
| `src/graphql/queries/favorite/getMyFavorites.ts`     | New file — `GetMyFavorites` query                                                                                                                                                                                                                                                                                                                                             |
| `src/components/Favorites/FavoriteButton.tsx`        | New component — a toggle button that: (a) reads `isFavorited` from the activity prop; (b) calls `addFavorite` or `removeFavorite` mutation on click; (c) shows optimistic UI state while the mutation is in-flight. Used on `ActivityListItem`.  We should implement some debouncing here to prevent spamming                                                                 |
| `src/components/ActivityListItem.tsx`                | Update the ActivityListItem to include a `FavoriteButton` component that will trigger a mutation that toggles the "favorite status" of the target activity for the current user                                                                                                                                                                                               |
| `src/components/Favorites/FavoritesList.tsx`         | New component — renders the drag-and-drop sortable list of favorited activities. Wraps items in `DndContext` + `SortableContext`. On drag end (`onDragEnd`): calls `arrayMove` to reorder local state immediately, then fires the `reorderFavorites` mutation with the new order (since the user will drag and drop, I'm not convinced we need any form of debouncing there). |
| `src/components/Favorites/SortableFavoriteItem.tsx`  | New component — a single draggable item using `useSortable` from `@dnd-kit/sortable`. Renders the activity card with a drag handle (grip icon).                                                                                                                                                                                                                               |
| `src/components/Favorites/index.ts`                  | Barrel export for `src/components/Favorites/*.tsx`                                                                                                                                                                                                                                                                                                                            |
| `src/graphql/mutations/favorite/index.ts`            | Barrel export for `src/graphql/mutations/favorite/*.ts`                                                                                                                                                                                                                                                                                                                       |
| `src/graphql/queries/favorite/index.ts`              | Barrel export for `src/graphql/queries/favorite/*.ts`                                                                                                                                                                                                                                                                                                                         |


#### Drag-and-Drop Interaction Design

##### What needs to be implemented
The drag-and-drop behavior on the profile page follows this sequence:

1. **Render**: `profil.tsx` fetches `getMyFavorites` in `getServerSideProps` and passes the ordered array as props. `FavoritesList` initialises its local `items` state from props.
2. **Drag start**: User presses and holds on a drag handle. `DndContext` activates; `useSortable` applies `isDragging` state. The dragged item gets a visual elevation/shadow (CSS `box-shadow`). Other items shift to show the insertion point.
3. **Drag over**: `SortableContext` with `verticalListSortingStrategy` handles the sort preview in real time — items visually reorder as the user drags, via CSS transforms only (no state mutation yet).
4. **Drag end (mouse released)**: `onDragEnd` callback fires with `{ active, over }`. If `active.id !== over.id`, call `arrayMove(items, oldIndex, newIndex)` to produce the new order and `setItems(newOrder)` immediately (optimistic update). Then fire the `reorderFavorites` mutation with `orderedIds: newOrder.map(item => item.id)`.
5. **Mutation success**: Apollo updates the cache. No visible change needed — the UI already shows the correct order from the optimistic update.
6. **Mutation error**: On failure, revert `items` to the pre-drag state and show a snackbar error notification.

##### What would be nice to have, but would depend on how we enforce an accessibility policy and how strict it needs to be

**Sensor configuration**: Use `PointerSensor` from `@dnd-kit/core` with an activation constraint of `{ distance: 5 }` (pixels) to prevent accidental drags when the user intends a click (e.g., navigating to the activity detail page). This is the standard accessibility-friendly configuration.
**Accessibility**: `@dnd-kit` supports keyboard navigation out of the box — users can reorder with arrow keys. Provide an `aria-label` on the drag handle button (e.g., `"Déplacer {activity.name}"`). The `SortableContext` announces position changes via ARIA live regions automatically.

#### Security / operations safety considerations

- All three mutations (`addFavorite`, `removeFavorite`, `reorderFavorites`) are protected by `@UseGuards(AuthGuard)`. A user cannot modify another user's favorites.
- `reorderFavorites` must validate that all provided `orderedIds` actually exist in the user's current `favorites` array before saving. A malicious request providing arbitrary IDs should be rejected with `BadRequestException`. This validation is done in `FavoriteService.reorderFavorites` by comparing the incoming IDs against the DB-stored favorites.
- `addFavorite` should validate that the referenced `activityId` exists in the `Activity` collection before adding it. We can leverage `ActivityService.findOne(activityId)` and throw `NotFoundException` if missing.
- In the spirit of the need to be wary of the size of the `favorites` array. We could not only enforce the size at controller level, but also by annotating `@ArrayMaxSize(20)` (`20` is purely indicative, but looks like a good first value) on the `ReorderFavoritesInput` DTO and by a guard in `addFavorite` before pushing.
