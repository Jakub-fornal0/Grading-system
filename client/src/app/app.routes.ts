import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { GradingSystemComponent } from './features/grading-system/grading-system.component';
import { ConfigurationComponent } from './features/configuration/configuration.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'configuration', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'configuration',
        children: [
          { path: '', component: ConfigurationComponent },
          {
            path: 'grading-system',
            component: GradingSystemComponent,
            data: { title: 'Grading System' },
          },
        ],
      },
    ],
  },
];
