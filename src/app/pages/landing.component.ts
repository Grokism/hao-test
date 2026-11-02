import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { OrgConfigService, OrgRuntimeConfig } from '../org-config.service';
import { PermsetService } from '../permset.service';

interface HealthStatus {
  status: string;
  stack?: string;
  proxy?: string;
  mongoConnected: boolean;
  dbName: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  template: `
    <ng-container *ngIf="orgConfig.config$ | async as cfg">
      <section class="hero-card">
        <div class="hero-top-badges">
          <span class="badge badge-ok">&#10003; Live on Bookins PaaS</span>
          <span class="badge badge-private">{{ archetypeBadge }}</span>
          <span
            class="badge"
            [class.badge-ok]="health?.mongoConnected"
            [class.badge-warn]="!health?.mongoConnected"
          >
            {{
              health?.mongoConnected
                ? 'MongoDB Online · ' + health?.dbName
                : 'Isolated Tenant MongoDB'
            }}
          </span>
        </div>

        <div class="hero-split">
          <div class="hero-copy">
            <div *ngIf="logoPath" style="margin-bottom: 14px;">
              <img
                [src]="logoPath"
                alt="Organization Logo"
                style="max-height: 54px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);"
              />
            </div>
            <h1 class="hero-title">john — Sybil-Resistant Governance & Voting</h1>
            <p class="hero-subtitle">One-human-one-vote governance portal for cooperatives, HOAs, neighborhood councils, and DAOs.</p>
            <p class="muted" style="margin: 0 0 16px;">Run 1-human-1-vote proposals and community budgets where amihuman guarantees no duplicate accounts and private PermSets verify organization membership.</p>

            <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOutHero">
              <ng-container *ngIf="permsets.access$ | async as evalState">
                <div class="actions-row" *ngIf="evalState.isAuthorized; else needsMembershipHero">
                  <a routerLink="/home">
                    <button>
                      Open {{ evalState.activeRoleLabel || 'Member' }} Workspace (/home) &rarr;
                    </button>
                  </a>
                  <a routerLink="/join">
                    <button class="secondary">Membership &amp; Role Status</button>
                  </a>
                </div>
                <ng-template #needsMembershipHero>
                  <div
                    class="permset-entry"
                    style="margin-top: 16px; border-color: rgba(245, 158, 11, 0.4);"
                  >
                    <strong>Signed in — awaiting a {{ cfg.appName }} PermSet</strong>
                    <p class="permset-explain">
                      Your handle is signed in, but it does not yet hold one of this application's
                      origin-scoped PermSets for <code>{{ cfg.origin }}</code>.
                    </p>
                    <div class="actions-row" style="margin-top: 12px;">
                      <a routerLink="/join"><button>Enroll or Request Role &rarr;</button></a>
                      <button type="button" class="secondary" (click)="permsets.refresh()">
                        Re-check Credentials
                      </button>
                    </div>
                  </div>
                </ng-template>
              </ng-container>
            </ng-container>

            <ng-template #loggedOutHero>
              <div class="actions-row">
                <button type="button" (click)="login('/home')">
                  PermSet Member Login &rarr;
                </button>
                <a routerLink="/join">
                  <button type="button" class="secondary">Become a Member (/join)</button>
                </a>
              </div>
            </ng-template>
          </div>

          <div class="hero-visual" *ngIf="heroPath">
            <img
              [src]="heroPath"
              alt="hao-test"
              style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14);"
            />
          </div>
        </div>
      </section>

      <!-- Configured PermSet Roles for This Application -->
      <section class="card">
        <div class="section-header">
          <div>
            <div class="eyebrow">Multi-Role PermSet Access Control</div>
            <h2>PermSet Roles Configured for {{ cfg.appName }}</h2>
          </div>
          <span class="badge badge-ok">Zero-PII Sybil Resistance</span>
        </div>
        <p class="muted" style="margin-top: 0;">
          Each role below is minted onto a member's Bookins handle as an origin-scoped private
          PermSet (<code>url = {{ cfg.origin }}</code>) and automatically unlocks its tailored
          workspace view at <code>/home</code>.
        </p>

        <div class="feature-grid">
          <div class="feature-tile" *ngFor="let role of roles">
            <div class="tile-kicker">
              <span>{{ role.enrollmentPolicy === 'self_enroll' ? 'Self-Enroll (/join)' : 'Admin Minted in Bookins.io' }}</span>
              <code>{{ role.roleKey }}</code>
            </div>
            <h3>{{ role.roleLabel }} PermSet</h3>
            <p>{{ role.purpose }}</p>
            <div *ngIf="role.scopeLabel" class="muted" style="font-size: 12px; margin-top: 6px;">
              Scope Tag: <strong>{{ role.scopeLabel }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Application Capabilities -->
      <section class="card">
        <div class="section-header">
          <div>
            <div class="eyebrow">Application Blueprint</div>
            <h2>What {{ cfg.appName }} Delivers</h2>
          </div>
          <span class="badge badge-private">MEAN + Nginx</span>
        </div>

        <div class="workflow-grid">
          <div class="workflow-step" *ngFor="let feat of keyFeatures; let i = index">
            <div class="step-badge">Capability {{ i + 1 }}</div>
            <p style="color: var(--text); font-size: 14.5px;">{{ feat }}</p>
          </div>
        </div>
      </section>

      <!-- Uploaded Visual Gallery (if provided) -->
      <section class="card" *ngIf="galleryAssets.length > 0">
        <div class="section-header">
          <div>
            <div class="eyebrow">Visual Showcase</div>
            <h2>{{ cfg.appName }} Gallery &amp; Media</h2>
          </div>
        </div>
        <div class="feature-grid">
          <div class="feature-tile" *ngFor="let img of galleryAssets">
            <img
              [src]="img.assetPath"
              [alt]="img.altText || img.fileName"
              style="width: 100%; height: 170px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;"
            />
            <p style="color: var(--text); font-weight: 600;">{{ img.altText || img.fileName }}</p>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class LandingComponent implements OnInit {
  health: HealthStatus | null = null;
  archetypeBadge = "Cooperative, HOA & DAO Governance Portal (Steward + Voting Member)";
  logoPath = "";
  heroPath = "";
  roles = [
  {
    "roleKey": "steward",
    "roleLabel": "Steward / Proposer",
    "purpose": "Publish governance proposals, resolutions, and community ballots.",
    "enrollmentPolicy": "issuer_only",
    "scopeLabel": "Committee / Precinct Tag (optional)"
  },
  {
    "roleKey": "voter",
    "roleLabel": "Voting Member",
    "purpose": "Review proposals and cast sybil-resistant 1-human-1-PermSet votes.",
    "enrollmentPolicy": "self_enroll",
    "scopeLabel": "Precinct / Unit Tag (optional)"
  }
];
  keyFeatures: string[] = [
  "Steward PermSet console to draft proposals, budget items, and ballot questions",
  "Voting Member PermSet ballot casting with 1-PermSet-1-vote enforcement",
  "Live transparent tallying stored in isolated tenant MongoDB"
];
  galleryAssets = [];

  constructor(
    public auth: AuthService,
    public orgConfig: OrgConfigService,
    public permsets: PermsetService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<HealthStatus>('/api/health').subscribe({
      next: (res) => {
        this.health = res;
      },
      error: () => {
        this.health = null;
      },
    });
  }

  login(target = '/home'): void {
    this.auth
      .loginWithRedirect({
        appState: { target },
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      })
      .subscribe();
  }
}
