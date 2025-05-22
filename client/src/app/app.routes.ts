import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TestComponent } from './layout/test/test.component';
import { GradingSystemComponent } from './features/grading-system/grading-system.component';
import { ConfigurationComponent } from './features/configuration/configuration.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'configuration', pathMatch: 'full' },
      { path: 'home', component: TestComponent },
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
