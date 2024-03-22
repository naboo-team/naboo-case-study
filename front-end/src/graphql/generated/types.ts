import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ActivityDto = {
  __typename?: 'ActivityDto';
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: UserDto;
  price: Scalars['Int']['output'];
};

export type CreateActivityInput = {
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFavorite: UserDto;
  createActivity: ActivityDto;
  login: SignInDto;
  logout: Scalars['Boolean']['output'];
  register: UserDto;
  removeFavorite: UserDto;
};


export type MutationAddFavoriteArgs = {
  activityId: Scalars['String']['input'];
};


export type MutationCreateActivityArgs = {
  createActivityInput: CreateActivityInput;
};


export type MutationLoginArgs = {
  signInInput: SignInInput;
};


export type MutationRegisterArgs = {
  signUpInput: SignUpInput;
};


export type MutationRemoveFavoriteArgs = {
  activityId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getActivities: Array<ActivityDto>;
  getActivitiesByCity: Array<ActivityDto>;
  getActivitiesByUser: Array<ActivityDto>;
  getActivity: ActivityDto;
  getCities: Array<Scalars['String']['output']>;
  getLatestActivities: Array<ActivityDto>;
  getMe: UserDto;
};


export type QueryGetActivitiesByCityArgs = {
  activity?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetActivityArgs = {
  id: Scalars['String']['input'];
};

export type SignInDto = {
  __typename?: 'SignInDto';
  access_token: Scalars['String']['output'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserDto = {
  __typename?: 'UserDto';
  email: Scalars['String']['output'];
  favourites: Array<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
};

export type ActivityFragment = { __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } };

export type OwnerFragment = { __typename?: 'UserDto', firstName: string, lastName: string };

export type AddFavoriteMutationVariables = Exact<{
  activityId: Scalars['String']['input'];
}>;


export type AddFavoriteMutation = { __typename?: 'Mutation', addFavorite: { __typename?: 'UserDto', email: string, firstName: string, lastName: string, id: string } };

export type CreateActivityMutationVariables = Exact<{
  createActivityInput: CreateActivityInput;
}>;


export type CreateActivityMutation = { __typename?: 'Mutation', createActivity: { __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, owner: { __typename?: 'UserDto', firstName: string, lastName: string } } };

export type RemoveFavoriteMutationVariables = Exact<{
  activityId: Scalars['String']['input'];
}>;


export type RemoveFavoriteMutation = { __typename?: 'Mutation', removeFavorite: { __typename?: 'UserDto', email: string, firstName: string, lastName: string, id: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SigninMutationVariables = Exact<{
  signInInput: SignInInput;
}>;


export type SigninMutation = { __typename?: 'Mutation', login: { __typename?: 'SignInDto', access_token: string } };

export type SignupMutationVariables = Exact<{
  signUpInput: SignUpInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', register: { __typename?: 'UserDto', id: string, email: string, firstName: string, lastName: string } };

export type GetActivitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActivitiesQuery = { __typename?: 'Query', getActivities: Array<{ __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } }> };

export type GetActivitiesByCityQueryVariables = Exact<{
  activity?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetActivitiesByCityQuery = { __typename?: 'Query', getActivitiesByCity: Array<{ __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } }> };

export type GetActivityQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetActivityQuery = { __typename?: 'Query', getActivity: { __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } } };

export type GetLatestActivitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestActivitiesQuery = { __typename?: 'Query', getLatestActivities: Array<{ __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } }> };

export type GetUserActivitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserActivitiesQuery = { __typename?: 'Query', getActivitiesByUser: Array<{ __typename?: 'ActivityDto', id: string, city: string, description: string, name: string, price: number, createdAt: any, owner: { __typename?: 'UserDto', firstName: string, lastName: string } }> };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getMe: { __typename?: 'UserDto', id: string, firstName: string, lastName: string, email: string, favourites: Array<string>, isAdmin: boolean } };

export type GetCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCitiesQuery = { __typename?: 'Query', getCities: Array<string> };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActivityDto: ResolverTypeWrapper<ActivityDto>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateActivityInput: CreateActivityInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SignInDto: ResolverTypeWrapper<SignInDto>;
  SignInInput: SignInInput;
  SignUpInput: SignUpInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UserDto: ResolverTypeWrapper<UserDto>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActivityDto: ActivityDto;
  Boolean: Scalars['Boolean']['output'];
  CreateActivityInput: CreateActivityInput;
  DateTime: Scalars['DateTime']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  SignInDto: SignInDto;
  SignInInput: SignInInput;
  SignUpInput: SignUpInput;
  String: Scalars['String']['output'];
  UserDto: UserDto;
};

export type ActivityDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityDto'] = ResolversParentTypes['ActivityDto']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addFavorite?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationAddFavoriteArgs, 'activityId'>>;
  createActivity?: Resolver<ResolversTypes['ActivityDto'], ParentType, ContextType, RequireFields<MutationCreateActivityArgs, 'createActivityInput'>>;
  login?: Resolver<ResolversTypes['SignInDto'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'signInInput'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'signUpInput'>>;
  removeFavorite?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationRemoveFavoriteArgs, 'activityId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getActivities?: Resolver<Array<ResolversTypes['ActivityDto']>, ParentType, ContextType>;
  getActivitiesByCity?: Resolver<Array<ResolversTypes['ActivityDto']>, ParentType, ContextType, RequireFields<QueryGetActivitiesByCityArgs, 'city'>>;
  getActivitiesByUser?: Resolver<Array<ResolversTypes['ActivityDto']>, ParentType, ContextType>;
  getActivity?: Resolver<ResolversTypes['ActivityDto'], ParentType, ContextType, RequireFields<QueryGetActivityArgs, 'id'>>;
  getCities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getLatestActivities?: Resolver<Array<ResolversTypes['ActivityDto']>, ParentType, ContextType>;
  getMe?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType>;
};

export type SignInDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInDto'] = ResolversParentTypes['SignInDto']> = {
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDto'] = ResolversParentTypes['UserDto']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favourites?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActivityDto?: ActivityDtoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignInDto?: SignInDtoResolvers<ContextType>;
  UserDto?: UserDtoResolvers<ContextType>;
};

