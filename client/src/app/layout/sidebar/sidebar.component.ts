import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public isMenuOpen: boolean = false;
  public sidebarItems: SidebarItem[] = [
    {
      label: 'Home',
      icon: 'domain',
      link: '/home',
    },
    {
      label: 'Configuration',
      icon: 'settings',
      link: '/configuration',
    },
  ];

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenuForMobile(): void {
    this.isMenuOpen = false;
  }
}
