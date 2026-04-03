import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <nav class="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/80 rounded-4xl mb-10 p-5 flex justify-between items-center shadow-2xl transition-all duration-500 hover:border-indigo-500/20">
      <div class="flex items-center gap-4 group">
        <div class="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 via-purple-700 to-fuchsia-800 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-white font-black text-2xl tracking-[0.2em] group-hover:text-indigo-400 transition-colors duration-500 uppercase">COSMOS</span>
          <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest -mt-1 group-hover:text-fuchsia-400 transition-colors duration-700">Deep Space Exploratory Hub</span>
        </div>
      </div>

      <button (click)="logout()" class="px-6 py-2.5 rounded-2xl text-[11px] font-black text-white bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all duration-500 uppercase tracking-widest active:scale-95 shadow-inner">
        Close Portal
      </button>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  logout() { this.authService.logout(); }
}
