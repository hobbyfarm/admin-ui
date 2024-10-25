import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SettingsService, Settings } from './settings.service';
import { fromEventPattern, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private settingsService: SettingsService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  listenToThemeChanges() {
    let mediaQuerySubscription: Subscription | null = null;

    return this.settingsService.settings$.subscribe((settings: Settings) => {
      if (settings.theme === 'system') {
        const darkModeMediaQuery = window.matchMedia(
          '(prefers-color-scheme: dark)'
        );
        // Applying the current system theme
        this.setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');

        // If system theme listener is not set up already, do it here
        if (!mediaQuerySubscription) {
          mediaQuerySubscription = fromEventPattern<MediaQueryListEvent>(
            (handler) => darkModeMediaQuery.addEventListener('change', handler),
            (handler) =>
              darkModeMediaQuery.removeEventListener('change', handler)
          ).subscribe((event) => {
            this.setTheme(event.matches ? 'dark' : 'light');
          });
        }
      } else {
        // Applying the user-defined theme directly
        this.setTheme(settings.theme);

        // Unsubscribing from media query listener if it exists
        if (mediaQuerySubscription) {
          mediaQuerySubscription.unsubscribe();
          mediaQuerySubscription = null;
        }
      }
    });
  }

  private setTheme(theme: 'light' | 'dark') {
    this.renderer.setAttribute(document.body, 'cds-theme', theme);
  }
}
