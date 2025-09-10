import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle"s
      (click)="toggleTheme()"
      [attr.aria-label]="
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
      "
      [attr.title]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <div class="theme-toggle-icon">
        <svg
          class="sun-icon"
          [class.hidden]="isDarkMode"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          />
        </svg>
        <svg
          class="moon-icon"
          [class.hidden]="!isDarkMode"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  `,
  styles: [
    `
      .theme-toggle {
        position: relative;
        width: 43px;
        height: 43px;
        border-radius: 50%;
        border: 0.3px solid var(--neutral-300);
        background: var(--surface);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .theme-toggle-icon {
        position: relative;
        width: 18px;
        height: 18px;
      }

      .sun-icon,
      .moon-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--text-primary);
      }

      .sun-icon.hidden {
        opacity: 0;
        transform: rotate(180deg) scale(0.8);
      }

      .moon-icon.hidden {
        opacity: 0;
        transform: rotate(-180deg) scale(0.8);
      }
    `,
  ],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}
