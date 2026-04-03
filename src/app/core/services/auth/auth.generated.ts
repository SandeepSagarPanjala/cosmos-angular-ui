import * as Types from '../../graphql/schema.generated';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type LoginUserMutationVariables = Types.Exact<{
  username: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser?: { __typename?: 'AuthPayload', accessToken?: string | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null, displayName?: string | null } | null } | null };

export type RefreshSessionMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type RefreshSessionMutation = { __typename?: 'Mutation', refreshSession?: { __typename?: 'AuthPayload', accessToken?: string | null, user?: { __typename?: 'User', id?: string | null, username?: string | null } | null } | null };

export type LogoutUserMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser?: boolean | null };

export type AddUserMutationVariables = Types.Exact<{
  username: Types.Scalars['String']['input'];
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type AddUserMutation = { __typename?: 'Mutation', addUser?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null };

export const LoginUserDocument = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    accessToken
    user {
      id
      username
      email
      displayName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginUserGQL extends Apollo.Mutation<LoginUserMutation, LoginUserMutationVariables> {
    override document = LoginUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RefreshSessionDocument = gql`
    mutation RefreshSession {
  refreshSession {
    accessToken
    user {
      id
      username
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RefreshSessionGQL extends Apollo.Mutation<RefreshSessionMutation, RefreshSessionMutationVariables> {
    override document = RefreshSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogoutUserGQL extends Apollo.Mutation<LogoutUserMutation, LogoutUserMutationVariables> {
    override document = LogoutUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddUserDocument = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    id
    username
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddUserGQL extends Apollo.Mutation<AddUserMutation, AddUserMutationVariables> {
    override document = AddUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }