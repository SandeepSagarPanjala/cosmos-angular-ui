import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GetAllExoplanetsGQL } from './exoplanet.generated';
import { Exoplanet } from '../../graphql/schema.generated';

@Injectable({
  providedIn: 'root'
})
export class ExoplanetService {
  private readonly getAllGQL = inject(GetAllExoplanetsGQL);

  /**
   * Natively executes the fully-typed GraphQL AST query against Pothos.
   * Leverages the apollo cache behind the scenes.
   */
  getAllExoplanets(): Observable<Exoplanet[]> {
    return this.getAllGQL.watch().valueChanges.pipe(
      map(result => (result.data?.exoplanets as Exoplanet[]) || [])
    );
  }
}
