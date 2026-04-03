import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common'; // 🛡️ LEVEL 5: Import only the specific pipe needed!
import { ExoplanetService } from '../../core/services/exoplanet/exoplanet.service';
import { Exoplanet } from '../../core/graphql/schema.generated';
import { NavbarComponent } from '../../core/components/navbar/navbar';
import { Messages } from '../../core/constants/messages.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, NavbarComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private exoplanetService = inject(ExoplanetService);

  public readonly messages = Messages;
  public readonly exoplanets = signal<Exoplanet[]>([]);
  public readonly loading = signal<boolean>(true);

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading.set(true);
    this.exoplanetService.getAllExoplanets().subscribe({
      next: (data) => {
        this.exoplanets.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(this.messages.Error.DataFetchFailed, err);
        this.loading.set(false);
      },
    });
  }
}
