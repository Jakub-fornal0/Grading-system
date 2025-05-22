import { Component } from '@angular/core';
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
})
export class SidebarComponent {
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
}
