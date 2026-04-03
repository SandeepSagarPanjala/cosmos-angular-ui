import * as Types from '../../graphql/schema.generated';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type GetAllExoplanetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllExoplanetsQuery = { __typename?: 'Query', exoplanets?: Array<{ __typename?: 'Exoplanet', id?: string | null, name?: string | null, scientificName?: string | null, imageUrl?: string | null, discoveredOn?: string | null, discoveredBy?: string | null, distanceFromEarthLy?: string | null, solarSystemName?: string | null }> | null };

export type GetExoplanetsDashboardQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetExoplanetsDashboardQuery = { __typename?: 'Query', exoplanets?: Array<{ __typename?: 'Exoplanet', id?: string | null, name?: string | null, imageUrl?: string | null }> | null };

export const GetAllExoplanetsDocument = gql`
    query GetAllExoplanets {
  exoplanets {
    id
    name
    scientificName
    imageUrl
    discoveredOn
    discoveredBy
    distanceFromEarthLy
    solarSystemName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllExoplanetsGQL extends Apollo.Query<GetAllExoplanetsQuery, GetAllExoplanetsQueryVariables> {
    override document = GetAllExoplanetsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetExoplanetsDashboardDocument = gql`
    query GetExoplanetsDashboard {
  exoplanets {
    id
    name
    imageUrl
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetExoplanetsDashboardGQL extends Apollo.Query<GetExoplanetsDashboardQuery, GetExoplanetsDashboardQueryVariables> {
    override document = GetExoplanetsDashboardDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }