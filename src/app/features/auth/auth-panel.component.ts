import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-panel',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel auth-panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Authentication</p>
          <h2>Firebase-ready sign in</h2>
        </div>
        @if (auth.profile(); as profile) {
          <span class="pill">{{ profile.provider }}</span>
        }
      </div>

      @if (auth.profile(); as profile) {
        <div class="profile-card">
          <div>
            <strong>{{ profile.displayName }}</strong>
            <p>{{ profile.email }}</p>
          </div>
          <div class="profile-actions">
            <button type="button" (click)="auth.logout()">Sign out</button>
            @if (profile.provider !== 'demo') {
              <button type="button" class="danger" (click)="confirmDeleteAccount()" [disabled]="auth.loading()">
                Delete account
              </button>
            }
          </div>
        </div>
      }

      <form class="auth-form" (ngSubmit)="submitEmailAuth()">
        <label>
          <span>Email</span>
          <input [(ngModel)]="email" name="email" type="email" placeholder="you@example.com" />
        </label>

        <label>
          <span>Password</span>
          <input [(ngModel)]="password" name="password" type="password" placeholder="Minimum 6 characters" />
        </label>

        <div class="actions">
          <button type="submit" [disabled]="auth.loading()">
            {{ mode() === 'register' ? 'Create account' : 'Sign in' }}
          </button>
          @if (mode() === 'login') {
            <button type="button" class="ghost" (click)="toggleRegisterMode()" [disabled]="auth.loading()">
              Create account
            </button>
          } @else {
            <button type="button" class="ghost" (click)="toggleRegisterMode()" [disabled]="auth.loading()">
              Back to sign in
            </button>
          }
          <button type="button" class="ghost" (click)="auth.signInWithGoogle()" [disabled]="auth.loading()">Google</button>
          <button type="button" class="ghost" (click)="auth.continueWithDemo()">Demo mode</button>
        </div>
      </form>

      @if (auth.error()) {
        <p class="note">{{ auth.error() }}</p>
      } @else {
        <p class="note">Email/password and Google flows are wired for Firebase Authentication once project keys are added.</p>
      }
    </section>

    @if (showDeleteDialog()) {
      <div class="dialog-overlay" (click)="cancelDelete()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h3>Delete Account</h3>
            <button type="button" class="close" (click)="cancelDelete()">&times;</button>
          </div>
          <div class="dialog-content">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <p><strong>All your data will be permanently deleted, including:</strong></p>
            <ul>
              <li>Habits and completion history</li>
              <li>Tasks and progress</li>
              <li>Money records</li>
              <li>Reflections and insights</li>
            </ul>
          </div>
          <div class="dialog-actions">
            <button type="button" class="ghost" (click)="cancelDelete()">Cancel</button>
            <button type="button" class="danger" (click)="deleteAccount()" [disabled]="auth.loading()">
              {{ auth.loading() ? 'Deleting...' : 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .auth-panel {
      display: grid;
      gap: 1rem;
    }

    .panel-header,
    .profile-card,
    .actions {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .profile-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    h2,
    p {
      margin: 0;
    }

    .auth-form {
      display: grid;
      gap: 0.9rem;
    }

    label {
      display: grid;
      gap: 0.4rem;
    }

    input {
      border-radius: 0.95rem;
      border: 1px solid var(--border-color);
      padding: 0.85rem 1rem;
      background: var(--input-bg);
      color: var(--heading-text);
    }

    button {
      border: 0;
      border-radius: 999px;
      padding: 0.75rem 1rem;
      background: var(--heading-text);
      color: var(--surface-text-inverse);
      font-weight: 600;
      cursor: pointer;
    }

    .ghost {
      background: transparent;
      color: var(--heading-text);
      border: 1px solid var(--border-color);
    }

    .danger {
      background: #dc3545;
      color: white;
    }

    .danger:hover {
      background: #c82333;
    }

    .pill,
    .note {
      color: var(--muted-text);
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--surface-bg);
      border-radius: 1rem;
      padding: 1.5rem;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .dialog-header h3 {
      margin: 0;
      color: var(--heading-text);
    }

    .close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--muted-text);
      padding: 0;
      width: 2rem;
      height: 2rem;
    }

    .dialog-content {
      margin-bottom: 1.5rem;
    }

    .dialog-content p {
      margin-bottom: 1rem;
      color: var(--body-text);
    }

    .dialog-content ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      color: var(--body-text);
    }

    .dialog-content li {
      margin-bottom: 0.25rem;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
  `
})
export class AuthPanelComponent {
  readonly auth = inject(AuthService);
  readonly mode = signal<'login' | 'register'>('login');
  readonly showDeleteDialog = signal(false);

  email = '';
  password = '';

  submitEmailAuth(): void {
    if (!this.email || !this.password) {
      this.auth.error.set('Please enter both email and password');
      return;
    }
    void this.auth.signInWithEmail(this.email, this.password, this.mode());
  }

  toggleRegisterMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.auth.error.set(null);
  }

  confirmDeleteAccount(): void {
    console.log('Delete account button clicked');
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
  }

  async deleteAccount(): Promise<void> {
    console.log('Delete account confirmed - calling auth service');
    this.showDeleteDialog.set(false);
    await this.auth.deleteAccount();
  }
}
