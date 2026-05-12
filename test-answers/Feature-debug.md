# Feature 2 - Debug mode

## Overview

Users with the `'admin'` role can enable a "debug mode" that overlays the creation date on every activity card shown in list views (discover, explorer, my-activities, home).
Regular `'user'`-role accounts see no change. 
The feature is purely read-only — `createdAt` is already stored on every `Activity` document via `@Schema({ timestamps: true })` and is already declared as a `@Field` on the `Activity` GraphQL type (`activity.schema.ts:36`). No new database field or schema migration is required.

## Sidenote
This feature could also directly resolve two pieces of dead code identified in the initial review (depending on which way we go) :
- `UserService.setDebugMode` (cf. YAGNI — BE-4 in the Review document): the method body is broken (references a phantom `debugModeEnabled` schema field).
- `user.schema.ts` missing `debugModeEnabled` field: the method writes to this field but the schema never declared it.

I don't think this is necessary, so I'll proceed leveraging the user's `role` instead.

## Analysis

### What we already have

* We need to identify admins among all users => there is already a `role` property for that
* We need to display the creation date of activities => it is already saved, which also means we don't need to worry about previously created activities not having a `createdAt` property

### What needs to be done

The initial request is really just about displaying the activities creation date if the target user is an admin.
* We need to update the front-end in 2 key ways : 
  * GQL querying, in order to get the `createdAt` information we're after
  * Several components that list activities so that the creation date is displayed whenever the user viewing them has the `admin` role
* We don't mention having to activate the debug mode that already sits in the codebase, the sole condition is "is the connected user an admin?" => we can probably forego implementing a dedicated debug mode

That way, we can go for a relatively simple approach, which would be to basically state that an "Admin" user has the debug mode enabled by default (at least for our current use). This has several consequences :

1. The `UserService.setDebugMode` mutation will remain unused => we can get rid of it entirely ("Boy Scout Rule")
2. We can have a very simple display condition that will display the creation date if and only if the logged-in user is an admin.
3. Since the `createdAt` property of an activity is currently not included in `ActivityFragment` (cf:`front-end/src/graphql/fragments/activity.ts`), and all activity list queries use this, it means `createdAt` is never fetched.
   We can simply add `createdAt` to the list of properties contained in the `ActivityFragment` fragment and be done "data-retrieval-wise". However, that prompts the question of if it is okay to expose that information to users with a role different from 'admin' since : 
   * All activity information would be fetched, just not always rendered in the UI, which means that a should a user succeed in exploring the Apollo cache/React state (with browser plugins), they would find the information.
   * In our context, this is just some non-critical debug information : it is probably fine to not go out of our way to hide it from regular users as it would add unneeded complexity for a low benefit.
   * If we really wanted to hide that information, one way to perform this would be to create distinct GQL queries for admin users which would include `createdAt` in the fragments used, whereas the ones we already have would remain unchanged for regular users.

## Back-End: Changes

No changes required

## Front-End: Changes

### 1. Add `createdAt` to `ActivityFragment`

Update `src/graphql/fragments/activity.ts` to include `createdAt`:

```graphql
fragment Activity on Activity {
  id
  city
  description
  name
  price
  createdAt
  owner { ...Owner }
}
```

This single change propagates `createdAt` to all five activity queries automatically, since they all rely on `ActivityFragment`.
After the change, run `npm run generate-types` to update the generated TypeScript types.

#### Semi-Nitpick
`createdAt` is typed as `DateTime` in the GraphQL schema, which is currently mapped to `any` in codegen. We can add a `scalars: { DateTime: string }` entry to `codegen.yml` so the generated type is `string` (ISO 8601), not `any`.
Not implementing that will not prevent anything from working, but it's best to get rid of `any`s so that our type system can act as a guardrail as much as possible.

### 2. Conditionally display `createdAt` in activity list components

Each activity card component needs to conditionally render the `createdAt` date when `user?.role === 'admin'`.

Modified files:

| File | Change                                                                                                                                                    |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/ActivityListItem.tsx` | Accept `showCreatedAt?: boolean` prop; conditionally render a `<Text size="xs" color="dimmed">Créé le {formatted date}</Text>` below the activity details |
| `src/components/Activity.tsx` | Same: accept `showCreatedAt?: boolean`; render `createdAt` in a subtle secondary style                                                                    |
| `src/pages/index.tsx` | Pass `showCreatedAt={user?.role === 'admin'}` to each `<Activity>` or `<ActivityListItem>`                                                                 |
| `src/pages/discover.tsx` | Same                                                                                                                                                      |
| `src/pages/my-activities.tsx` | Same                                                                                                                                                      |
| `src/pages/explorer/[city].tsx` | Same                                                                                                                                                      |
| `src/pages/activities/[id].tsx` | Render `createdAt` directly on the detail page when user role is `admin` (no prop needed — reads from `useAuth()`)                                        |

**Date formatting**: Since the project has no date library installed, we can simply leverage `Date` with something like `new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })` (since all templates use french, `fr-FR` seems like an appropriate locale).

## Security Considerations

* The `role` field we'll leverage is included in the JWT payload, which makes it tamper-proof. The `RolesGuard` trusts the decoded payload (already verified by `jwtService.verifyAsync` in the context factory), so the UI should make an appropriate use of the `role` we get from our user
