# Codebase comments

- setup workspaces - turborepo
- use env variables for config
- decides between yarn and npm
- schema.gql is committed but generated
- GraphQL schema doesn't handle pagination
- clarify token saving on user model (multi-session? multi-client?)
- position arguments for model attributes ~ does not scale well
- what about mongo object migrations
- nested object resolution policy isn't clear
- Auth JWT tokens payload is currently mapped to User GraphQL type
- use graphql codegen to generate full fledge hooks -- https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-react-apollo#with-react-hooks
- save auth token as both cookie and LocalStorage

# Design - Favorites Feature

## Model

User.id <-> Activities.id

```gql
extend type User {
  favoriteActivites: [{Activites, position}!]!
}

extend type Mutation {

}
```

```ts
user.favoriteActivities: {activityId: ID, position: number}[]
```

// back - when adding new favorite: start with 0 when there none yet, else remove K (K=1000) to the lowest user favorite index
// front - when moving up from current index n to index n-1 > new position is (item[n-1] + item[n-2] / 2)
// front - when moving down from current index n to index n+1 > new position is (item[n+1] + item[n+2] / 2)
// -- when +2/-2 element does not exist > add or remove K
// sort: order by ascending `position`

## TODO

- back-end
  - add favoritesActivities model on mongo
    - test the service
    - seed
  - expose favorites at GraphQL Layer
- front-end
  - display
- backend
  - reorder mutations
- front
  - move up-down reording

# Design - Debug mode / permission

## Principles

- never expose role&permission logic, only permissions

## Model mongo

user.role: admin | member
user.debugModeActivated: boolean

## Graphql

```gql
extend type User {
  role: admin | member
  features: {
    debugMode: boolean # user.debugModeActivated && user.permissions.canEnableDebugMode
  }
  permissions: {
    canEnableDebugMode: boolean
  }
}
```

- add guard on activity.createdAt based on the same helper as user.permissions.canEnableDebugMode
