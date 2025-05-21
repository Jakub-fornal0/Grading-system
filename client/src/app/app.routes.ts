import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TestComponent } from './layout/test/test.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'configuration', pathMatch: 'full' },
      { path: 'home', component: TestComponent },
      { path: 'configuration', component: TestComponent },
    ],
  },
];
