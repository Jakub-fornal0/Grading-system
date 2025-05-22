import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export interface Tile {
  title: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  public tiles: Tile[] = [
    {
      title: 'Grading System',
      icon: 'grading',
      link: '/configuration/grading-system',
    },
  ];
}
