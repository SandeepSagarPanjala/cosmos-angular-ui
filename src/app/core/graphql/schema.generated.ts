export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Exoplanet = {
  __typename?: 'Exoplanet';
  discoveredBy?: Maybe<Scalars['String']['output']>;
  discoveredOn?: Maybe<Scalars['String']['output']>;
  distanceFromEarthLy?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  leadResearcherId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  solarSystemName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addExoplanet?: Maybe<Exoplanet>;
  addUser?: Maybe<User>;
  loginUser?: Maybe<AuthPayload>;
  logoutUser?: Maybe<Scalars['Boolean']['output']>;
  refreshSession?: Maybe<AuthPayload>;
};


export type MutationAddExoplanetArgs = {
  discoveredBy?: InputMaybe<Scalars['String']['input']>;
  discoveredOn?: InputMaybe<Scalars['String']['input']>;
  distanceFromEarthLy?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  leadResearcherId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  scientificName?: InputMaybe<Scalars['String']['input']>;
  solarSystemName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddUserArgs = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationLoginUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  exoplanets?: Maybe<Array<Exoplanet>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};
