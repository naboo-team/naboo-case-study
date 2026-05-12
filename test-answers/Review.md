# Naboo Case study - Code review

## General remarks

### Introduction

This is a small app for a leisure activity discovery platform. It is called CDTR.
In this app, users can browse, filter, and create activities (hiking, spa, yoga, museums, etc.) organized by city.

### Methodology

1. Manual fast pass to look for "usual suspects"
   * Look at configuration files, project layout, tests, scripts to see if anything immediately jumps at me as in need of further digging
   * Isolate those few items to orient prompting
2. AI prompt (Claude sonnet 4.6)
   * Sequentially asked for targeted reviews about :
     * Industry standard practices
     * Anti-patterns / non standard practices
     * Dead code / duplicated logic
     * Dependencies usage (missing, unused, misplaced)
     * General code hygiene (consistency, linting, formatting)
3. Review AI findings, confront them to initial observations, check for false-positives, synthesize findings, provide some extra-research, generally do my best to not blindly copy/paste AI output when in doubt


## Basic architecture
This is a dual-app monorepo that consists in a backend app that exposes a GraphQL endpoint, coupled to a front-end that consumes it. This feels most standard, relatively simple but with some room to grow (for multiple client apps, for example)

```
naboo-case-study-master/
├── back-end/    ← NestJS API (port 3000)
└── front-end/   ← Next.js 13 app (port 3001)
```

### Tech Stacks

| Layer | Technologies |
|---|---|
| **Backend** | NestJS, GraphQL (Apollo, code-first), MongoDB + Mongoose, JWT auth, bcrypt, Docker |
| **Frontend** | Next.js 13 (Page Router), Mantine UI, Apollo Client, GraphQL Codegen, Vitest |
| **Shared** | TypeScript end-to-end, auto-generated GQL types |


## Code review

### General documentation (toplevel)
| # | Source                                                    | Claim                                                                     | Reality                                                                                                                                                                                                                                                                           |
|---|-----------------------------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DOC-1 | launch instructions                                       | Crash: Backend starts with `npm run start:dev` (no prerequisite)          | MongoDB must be running first. The root `readme.md` omits the required `npm run start:db` (Docker) step entirely; without it the app crashes on connection (more on that in backend findings).                                                                                    |
| DOC-2 | tech stack                                  | Nitpick: Lists `axios` as a frontend technology                           | Axios is only used for one utility (`services/cities.ts`). The primary data-fetching layer is Apollo Client / GraphQL. Listing axios at the same level as Apollo could be seen as a misrepresentation the architecture.                                                           |
| DOC-3 | tech stack                                  | Claims "data mapper pattern" for the backend                              | The codebase uses the **Active Record**-leaning pattern (Mongoose documents extend `Document`, service methods call `user.save()` directly on model instances). A true data mapper would separate the domain model from the persistence model. The claim is inaccurate.           |
| DOC-9 | no mention of `.env` setup                  | No instruction to copy `.env.dist` to `.env`                              | The backend will silently use `undefined` for `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` if `.env` is not created — causing cryptic startup failures. This critical setup step is absent from all documentation.                                                               |
| DOC-10 | no mention of `generate-types` prerequisite | Mentions `npm run generate-types` only under "after graphql modification" | The frontend **requires** the generated `src/graphql/generated/types.ts` file to compile at all. If a developer clones the repo and runs `npm run dev` without first running `generate-types` (or having the file committed), the build fails. The setup order is not documented. |

### Back-end
Between my own observations and the ones made by AI, here is a selection of the different things I found

#### Documentation (README.md)
| # | Source | Claim | Reality |
|---|---|---|---|
| DOC-4 | installation | Uses `yarn install` / `yarn run ...` commands throughout | The `back-end/package.json` lock file is `package-lock.json` (npm). The project is npm-based. Using `yarn` commands may or may not work depending on the developer's environment and will produce a mixed lockfile state. |
| DOC-5 | content | Boilerplate NestJS README — describes a generic NestJS starter, mentions API routes, etc. | The file was never updated for this project. It contains no project-specific information (no mention of GraphQL, MongoDB setup, environment variables, or `.env.dist`). |

#### General
* `src/main.ts` contains critical configuration as a "set it and forget it" practice so that one does not have to configure endpoints individually (specifically the ValidationPipe).
* global configuration in `main.ts` also sets up CORS configuration out of the bat and makes it so that the cookie middleware is mounted as early as possible, which should prevent unpleasant surprises down the line
* Base nest module config (`src/app.module.ts`) is made global to avoid re-importing it multiple times, which is an idiomatic NestJS practice, as far as I know.
* Logging
  * Nest's `Logger` is used : which is probably the way to go =)
  * We don't log much at this point so it'll likely be complex to know what is happening if anything were to break
    * conversely, we don't, yet, aggregate logs / metrics anywhere that I can see, but considering the state of that particular project that could just be a "next step" situation
* `.env` file requires a manual operation to even exist but it is required for the app to boot up correctly
  * we could add a `"buildConfiguration": "shx cp .env.dist .env"` script to be called before `start` (but it requires `shx`)
    * this could then be replaced by something more comprehensive, if we want finer control on how `.env` gets built
  * we could also simply rename `.env.dist` to `.env` which would be simpler & more straightforward __but__ it might lead to errors like using a "dev" configuration for other purposes. Building the configuration is probably the right move.
* The backend's bootstrap needs a `FRONT_END_URL` env var to be setup to correctly enable CORS but no checks are made to ensure it is present before bootstrapping. This will silently pass and allow all origins, if memory serves, but it likely needs to be hardened in the event it were to be deployed on an environment more sensitive than a local machine.
* Systematic schema validation coupled with mongoose likely reduce the risk of trivial injections __but__
  * `activity/activity.service.ts` provides the surface for a ReDoS since we're taking a user-supplied filter string and pass it directly into a MongoDB `$regex` query with no escaping : we should probably tend to this and ensure the user provided data is escaped in that specific case
  * the app validationPipe could be configured in order to only accept whitelisted parameters (c.f 'whitelist' down in https://docs.nestjs.com/techniques/validation#overview)

#### tsconfig
* strict mode has been set, which is generally considered an enhancement to default behavior and will definitely harden typechecks down the line

#### Mongoose
* `user.service` adds the `{new: true}` option in its update queries, I've always found the default behavior to be a bit strange. In my book this is a good practice (and I don't think it can be globally setup so it's probably the best place to see it).
* I've been burned enough by Mongoose that I don't fully trust their semver compliance (it has been a while, which means I may be overreacting). I would likely pin the exact version that works for me instead of `^x.y.z` as I've had to scramble in the past to identify issues tied to breaking changes shipped inside update/patch versions.
* This might contradict the previous point, but the version included `package.json` is a bit behind, so maybe it'd be worth upgrading (after thorough testing).

#### Tests
* e2e tests seem to at least cover the "happy path" (signup, signin, getme).
    * It is a good thing to have these safeguards, at least at such a high level. If configured properly this reduces the chances of a build to break once deployed.
    * Setup is made to avoid collisions (with the usage of UUIDs)
    * Not much done in terms of Teardown, but at least the DB connection is explicitly terminated which is almost always forgotten.
        * __but__ it is done using an in-memory (`mongodb-memory-server`) so it'd probably be redundant anyway
        * __and__ this termination is not awaited, and it really should be in order to ensure that once tests exit we definitely closed the connection
* mid-to-low level tests (typically : integration / unit tests)
  * very few
    * some services / modules are lightly tested
      * some tests like in `src/activity/activity.service.spec` might not be very relevant (testing initialization but no other logic)
    * this is something I'd want to remedy as soon as possible since it'll get progressively harder as code gets added and e2e tests won't be able to catch everything / will get progressively more involved and difficult to maintain if we were to only use those
  * The tests encountered leverage Nest's testing tools, which is, in my opinion, a good thing as it'll help keep things as standard as can be (which means sensible maintainability, and support, in the long run)
  * Some test setups could be optimized. For example, in `src/user/user.service.spec.ts`, the testing module gets re-created before each test is run : maybe we could move it in a `beforeAll` step as the current test configuration should protect us from cross test contamination (use of UUIDs for the few writes there are). 

#### Reliance on standard lib for promise management
Not much to add. I think it is a good practice to not try to add too much too fast to a project. Standard `Promise` has evolved enough so that it handles most cases.

#### Security
* In `src/auth/auth.resolver`, tokens are stored in `httpOnly` cookies and, hence, are inaccessible to JavaScript. This is particularly appropriate when storing session tokens (like we're doing here for the JWT)
* `/logout` endpoint ensures cookies are cleaned up back-end side
* `src/user/user.service.ts:40` : user passwords are hashed, we are using bcrypt and what looks like the minimal OWASP recommendation (cf: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt), which already means that there's a will to follow OWASP's guidelines.
    * Note, the `10` used as a second parameter could look a bit like a "magical constant" => maybe we'd want this constant to be extracted to a `SALT_GENERATION_PASSES` constant for readability purposes, since this isn't exactly a region of the code where one would find themselves daily
* mongo connection options in `app.module` seem to only rely on the one MONGO_URI env variable. 
  * I would have expected the connection parameters to at least implement some basic access control. Here it looks like provided the database is up at the given address then it should be enough to connect. 
  * This is likely not transferable to a production ready environment (typically if we decide to use a 3rd party provider like Atlas), but surely is enough for dev purposes.
  * By extension, since the configuration is so bare, we're also missing various options (retries, timeouts, maxPoolSize ...)

#### GraphQL
* We likely do not want the GQL `playground` mode to be activated by default on every instance we deploy (cf: `src/app.module.ts:33`)

#### JWT
* `src/auth/types/jwtPayload.dto.ts`
    * DTO defined as a type, which is probably what we want (we want the "shape" to validate / typecheck but won't need to instanciate any)
    * `Payload` might be a bit non-descript, it could probably be renamed to `JWTPayload` or event `JWTPayloadDTO` to lift any ambiguities.
* `src/user/user.service.ts`'s `updateToken` method stores the JWT token as is. If we don't need to process it, and it is just here to authenticate a user, we could hash the token and compare the stored version to a hashed token whenever needed. What is more, if the database ends up being compromised in some way, the hashed tokens would basically be worthless to the attacker.

#### package.json
* Some dependencies have seen major releases and might need an upgrade but
  * This is likely due to the format of the exercise, so I won't delve for too long on this
  * This might be intentional (but then I haven't come across documentation that would explain why)
    * If not, tools like renovate can definitely help keep up (as it is a major pain doing such things by hand)
* scripts that rely on `docker-compose` will fail, since there isn't any `docker-compose.yml` (all are about managing a mongodb container) => if this isn't fixed it is unlikely for the backend to even start (at least for a local dev mode)

#### NestJS practices
Base setup seems okay, most practices seem standard enough (some might be a bit outdated, but not to the point of being broken). Some improvements could be made, though.

* `user/user.schema.ts` & `activity/activity.schema.ts`: Schema classes extend `Document` directly; modern Mongoose + NestJS best practice is `HydratedDocument<T>` with a plain class.
* In `app.module.ts`, `JwtModule` is imported without configuration inside `GraphQLModule.forRootAsync`, but from what I can see 
  * the only place it is really used is in the auth module ... which already handles this import and actually correctly relies on JWT_SECRET / JWT_EXPIRATION_TIME configuration
  * the way jwtModule is registered in app.module is done with default values
  * this means we're instantiating 2 different instances of jwtModule, with potentially different configuration : we might luck out, but it poses obvious risks of believing we're using a correctly configured implementation even though we might not, which could transform into (best case) a maintenance headache, or (worst case) a security issue, since we're talking about the service that'll manage our JWT tokens.
    * We probably don't need this instance at all => since AuthModule exports its correctly built JwtModule, we could have AuthModule replace the import, removing the risk and making the codebase more maintainable as a side effect
    * If we absolutely wanted 2 distinct instances, the one instantiated through the app module should at the very least be obtained through a factory so that we'd get the same configuration

#### unused/dead/duplicated code

Dead functions (not called)

| # | File | Lines | What                                                                                                                                                                                                           |
|---|---|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BE-1 | `activity/activity.service.ts` | 35–37 | `findByIds(ids: string[])` : batch-fetch by IDs. Defined and exported, never called by any resolver, seed, or test. Likely a stub for a "favorites" or "bookmarks" feature that was never built.               |
| BE-2 | `activity/activity.service.ts` | 67–69 | `countDocuments()` on `ActivityService`: never called from anywhere.                                                                                                                                           |
| BE-3 | `user/user.service.ts` | 54–56 | `countDocuments()` on `UserService` : never called from anywhere.                                                                                                                                              |
| BE-4 | `user/user.service.ts` | 58–76 | `setDebugMode({ userId, enabled })` : writes to a `debugModeEnabled` field that does not exist on the `User` Mongoose schema. No GraphQL resolver exposes it, no caller invokes it.|

Notes : 
* I guess that `setDebugMode` could be used for the 2nd feature being asked for in the test (either out of the box of after a few adaptations) but, as it stands, it is completely unused.
* Besides that last point, one could assume that this code could be outright removed. Even with the hindsight of modifications to come, one could argue that dead code should be taken with a pinch of salt as it might not exactly fit what would be required for a new feature. Likely it'd've to be at the very least overhauled, if not rewritten.

Unused injections

| # | File | Lines | What |
|---|---|---|---|
| BE-5 | `activity/activity.resolver.ts` | 15, 26 | `UserService` is imported and injected into the constructor (`private readonly userServices: UserService`) but never referenced in any resolver method. Dead injection. |

Unused dependencies

| Package | Type | Reason |
|---|---|---|
| `@apollo/gateway` | `dependencies` | Never imported anywhere in `src/`. The app uses `@nestjs/apollo` + `@apollo/server` directly. Federation/gateway is unused. |
| `ts-morph` | `dependencies` | Never imported anywhere. A code-generation/AST utility with zero usage. |
| `class-transformer` | `dependencies` | Never imported. No `@Type`, `plainToClass`, or `transform: true` usage exists in the project. |
| `class-transformer-validator` | `dependencies` | Never imported. Companion to `class-transformer`, equally unused. |
| `@types/cookie` | `devDependencies` | The raw `cookie` package is never used directly (only `cookie-parser` middleware is). |
| `@types/ws` | `devDependencies` | No WebSocket code anywhere in the project. |

### Front-end

#### Documentation (README.md)

| #       | Source     | Claim                                                                                                                 | Reality                                                                                                                                                                                                                                                                           |
|---------|------------|-----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DOC-6   | port       | States "Open http://localhost:3000 to see the result"                                                                 | The frontend runs on **port 3001** (configured in `package.json`: `"dev": "next dev -p 3001"`). Port 3000 is the backend.                                                                                                                                                         |
| DOC-7   | API routes | References `pages/api/hello.ts` and API routes on `localhost:3000/api/hello`                                          | No `pages/api/` directory exists in the frontend. The backend handles all API routes. This is boilerplate Next.js README content that was never removed.                                                                                                                          |
| DOC-8   | fonts      | Claims the project uses `next/font` to load Inter                                                                     | `next/font` is not used anywhere in the codebase. `_document.tsx` uses the Mantine SSR helper; no custom font loading is configured. Boilerplate content left in place.                                                                                                           |
| DOC-10  | scripts    | `generate-types` is never mentioned, though it is required to even build (copied from toplevel documentation remarks) | The frontend **requires** the generated `src/graphql/generated/types.ts` file to compile at all. If a developer clones the repo and runs `npm run dev` without first running `generate-types` (or having the file committed), the build fails. The setup order is not documented. |

#### General
* Some URls are manually specified and rely on the `http` protocol. If we were to deploy this, we'd want to update the way URLs are built to avoid `http` in favor of `https` when not on a dev/sandbox environment

#### JWT / Security
* Token is stored in localStorage which contradicts, in a way, the fact that it already sits in an `httpOnly` cookie. Not only that, but the localstorage makes it accessible to any JS running on the page (which we probably do not want)
* `access_token` is being sent back by the signin endpoint. For the same reasons as the 1st point, it is probably unnecessary as the token is already in the HttpOnly cookie

#### Architecture
* The ApolloClient is shared among users (cf: `graphql/apollo.ts`). This is probably something we do not want to happen and have each user have its own client instance (and the cache that goes with it, since it is defined upon initialization). Maybe it'd be best to initialize individual clients upon the app creation (in `_app.ts`) so that every user's client is isolated and no data leakage can occur.

#### Configuration
Some of the front-end code relies on hardcoded `localhost` URLs -> maybe we could parametrize those through a configuration service that gathers all the necessary information at server startup
* `graphql/apollo.ts:6`
* `services/axios.ts:3`

#### tsconfig.js
* strict mode is present, as for the back-end app, and is a welcome sight for the same reasons

#### React / UI
* Looks like it has a standard architecture, which means someone new can dive in and have an idea of the basics / where to find what
* The cached apollo client means that, at least at this point, there's no real need for a store management library like redux, which reduces the base complexity
* file naming: small inconsistency with `profil` amid an otherwise all-english naming scheme (the language in templates is French, which is fine if the target audience is french too, but I'd advocate for a single language when it comes to coding conventions)
* a dedicated debouncing hook is present, this will avoid (re)querying the gql API too often for searches using text inputs (like in activity search), it is also used with query string parameters (I'm not that sure this is as relevant)
* No I18N/L10N at this point. Depending on the languages one would want to tackle and the desired scope of the app, this could come back to haunt devs (as it is generally tedious and error-prone when implemented after the fact). It is certainly not needed right now, but should definitely be considered moving forward (after fixing the more pressing issues to be able to deploy to different environments in the first place)

#### Testing
* vitest is in the dependencies which is a nice, more efficient, alternative to Jest today. With the added bonus that it basically has the same APIs so it won't puzzle any dev who hasn't yet used it.
* Not much in terms of automated testing. Ideally, we'd want at the very least an e2e test that checks the main "happy path" or, failing that, we can always bootstrap a React testing wrapper like https://www.npmjs.com/package/react-test-wrapper/ to test the app in itself and mock the API calls.
* There is a little inconsistency in how the few tests that exist sit in the app tree. For the `Topbar` component, tests seem to live in their dedicated `__tests__` directory, whereas for `PageTitle` they are at the same level as the component being tested
  * Note: since the `vitest.config.ts` file uses globbing patterns to look for files with a specific name, but not specific directories (cf: `"**/*.{test,spec}.{ts,tsx}"`), that should not affect if a correctly named test file will be run or not.
  
#### package.json scripts
* `generate-types` uses `cp`. This is probably fine provided no-one has the odd idea of building using a Windows machine but, to be 100% safe, this could be changed to use `shx` (`shx cp [...]`).

#### Unused/Dead/Duplicated code & dependencies

#### "Long story short"
There are a few pieces of dead code, essentially in `profil.tsx`.
Most occurrences of dead code or unnecessary imports can be removed, some seem to be tied to the "favorites" feature request, which could justify at least having a look and see if they can be re-used.
I would generally throw away pre-existing dead code rather than try and salvage it, as it is usually this way one tries to "make a big circle fit in a tiny square" in terms of design, which generally hurts maintainability and readability.

unused/dead/duplicated code

| # | File | Lines | What                                                                                                                                                                                                                                                                                          | What to do?                                    |
|---|---|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| FE-1 | `pages/profil.tsx` | 9–14, 16 | `ProfileProps.favoriteActivities` - As it stands, could be taken for an abandoned feature, but likely there to be used by the "favorites" feature request                                                                                                                                     | Update when implementing the "favorites" feature |
| FE-2 | `graphql/generated/types.ts` | 183–337 | The entire bottom half of the generated file is server-side resolver scaffolding (`ResolverFn`, `ActivityResolvers`, `QueryResolvers`, `MutationResolvers`, etc.) generated by the `typescript-resolvers` codegen plugin. None of these types are imported or used anywhere in the front-end. | Can likely be safely removed                 |
| FE-3 | `utils/mantine.theme.ts` | 3–6 | `mantineTheme` object contains only two fields (`colorScheme`, `primaryColor`) — the file adds a layer of indirection with no real customisation beyond the Mantine defaults. Clearly intended as an extensible theme file, but no customisation was ever added.                              | Can likely be safely removed                 |

Unused Imports

| # | File | Lines | What | What to do?                  |
|---|---|---|---|------------------------------|
| FE-4 | `pages/profil.tsx` | 2 | `graphqlClient` imported but never used — the file has no `getServerSideProps`. | Can likely be safely removed        |
| FE-5 | `pages/profil.tsx` | 6 | `GetServerSideProps` type imported but no `getServerSideProps` function exists in the file. | Can likely be safely removed        |
| FE-6 | `pages/explorer/[city].tsx` | 12 | `useSearchParams` from `next/navigation` (App Router) imported into a Pages Router file. The hook is called but its result is immediately superseded by a shadowed `const searchParams` inside the `useEffect` (line 67). | Can likely be safely removed |

Duplicated Logic

| # | Files | What |
|---|---|---|
| FE-7 | `hocs/withAuth.tsx` lines 18–23 & `hocs/withoutAuth.tsx` lines 18–23 | The loading-spinner JSX block is **copy-pasted verbatim** between both HOC files. Should be extracted into a shared `AuthLoadingState` component or a single `withAuthGuard(condition)` factory. |
| FE-8 | `pages/discover.tsx` lines 40–44 & `pages/my-activities.tsx` lines 42–46 | Identical "add activity" button block (`{user && <Link href="/activities/create"><Button>Ajouter une activité</Button></Link>}`) duplicated across two pages. Should be a shared component. |
| FE-9 | `graphql/mutations/activity/createActivity.ts` lines 8–14 | Manually inlines the full activity field selection (`id`, `city`, `description`, `name`, `price`, `owner { firstName lastName }`). This is **identical to `ActivityFragment`** already defined in `graphql/fragments/activity.ts`. The mutation should spread `${ActivityFragment}` instead of repeating the fields, which risks them drifting out of sync. |

Unused npm Dependencies

| Package | Type | Reason |
|---|---|---|
| `@graphql-codegen/typescript-resolvers` | `devDependencies` | Generates server-side resolver types in a client-only app. The ~150 lines of generated resolver scaffolding in `types.ts` are entirely unused by the frontend code. Only `typescript` and `typescript-operations` plugins are needed. |
| `@emotion/server` | `dependencies` | Never imported directly in source. SSR emotion extraction is handled internally by `@mantine/next` (`createGetInitialProps`). |

Incomplete / Inconsistent Barrel Exports

| # | File | What |
|---|---|---|
| FE-10 | `components/Form/index.ts` | Exports `SigninForm` and `SignupForm` but **not** `ActivityForm`. The third form component is silently excluded from the barrel, forcing consumers to import it by direct file path. |
| FE-11 | `services/index.ts` | `axiosInstance` is a named export in `services/axios.ts` but is not re-exported through the barrel `services/index.ts`, creating a misleading public API surface. |
| FE-12 | `components/Topbar/index.ts` | Does not export `checkRouteAccess`, which is exported from `getFilteredRoutes.ts`. That export is reachable only via the test file or a direct deep import, not through the public barrel. |
