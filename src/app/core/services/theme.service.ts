import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly mode = signal<'light' | 'dark'>('light');

  constructor() {
    const savedMode = globalThis.localStorage?.getItem('productivity-theme');
    if (savedMode === 'dark' || savedMode === 'light') {
      this.mode.set(savedMode);
    }

    effect(() => {
      const currentMode = this.mode();
      this.document.body.dataset['theme'] = currentMode;
      globalThis.localStorage?.setItem('productivity-theme', currentMode);
    });
  }

  toggle(): void {
    this.mode.update((mode) => (mode === 'light' ? 'dark' : 'light'));
  }
}
