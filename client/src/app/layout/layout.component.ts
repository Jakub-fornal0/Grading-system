import { Component, DestroyRef, inject } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TopBarComponent } from './top-bar/top-bar.component';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, TopBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  public showTopBar: boolean = false;
  public topBarTitle: string = '';

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.initTopBarListener();
  }

  private initTopBarListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const currentRoute = this.getChildRoute(this.route);
        this.topBarTitle = currentRoute.snapshot.data['title'] || '';
        this.showTopBar =
          this.router.url.startsWith('/configuration/') &&
          this.topBarTitle !== '';
      });
  }

  private getChildRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }
}
