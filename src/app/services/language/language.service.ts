import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LANG_STORAGE_KEY = 'selected_language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);

  initLanguage(): void {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    window.location.reload();
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}
