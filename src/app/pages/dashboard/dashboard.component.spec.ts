import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { type MockInstance, vi } from 'vitest';

import { DashboardComponent } from './dashboard.component';
import { ExoplanetService } from '../../core/services/exoplanet/exoplanet.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Exoplanet } from '../../core/graphql/schema.generated';

describe('DashboardComponent', () => {
  let getAllExoplanetsSpy: MockInstance<ExoplanetService['getAllExoplanets']>;

  beforeEach(() => {
    const exoplanetServiceMock: Partial<ExoplanetService> = {
      getAllExoplanets: vi.fn(),
    };
    
    const authServiceMock: Partial<AuthService> = {
      isAuthenticated: vi.fn(() => true),
      logout: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: ExoplanetService, useValue: exoplanetServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ],
    });

    const exoplanetService = TestBed.inject(ExoplanetService);
    getAllExoplanetsSpy = vi.spyOn(exoplanetService, 'getAllExoplanets') as MockInstance<ExoplanetService['getAllExoplanets']>;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads exoplanets on initialization', () => {
    // Matching the REAL schema from schema.generated.ts
    const mockData: Exoplanet[] = [
      { 
        id: '1', 
        name: 'Kepler-452b', 
        scientificName: 'Kepler-452b',
        discoveredOn: '2015-07-23',
        distanceFromEarthLy: '1402',
        solarSystemName: 'Kepler-452',
        imageUrl: 'https://example.com/image.jpg',
        __typename: 'Exoplanet'
      }
    ];
    
    getAllExoplanetsSpy.mockReturnValue(of(mockData));

    const fixture: ComponentFixture<DashboardComponent> = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(getAllExoplanetsSpy).toHaveBeenCalled();
    expect(component.exoplanets()).toEqual(mockData);
    expect(component.loading()).toBe(false);
  });

  it('handles error when data fetch fails', () => {
    getAllExoplanetsSpy.mockReturnValue(throwError(() => new Error('Array failure')));

    const fixture: ComponentFixture<DashboardComponent> = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.exoplanets()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
});
