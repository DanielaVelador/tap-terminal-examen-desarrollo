import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = 'tap_token';
  private sectionsKey = 'tap_sections';

  login(email: string, password: string): Observable<string[]> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.setToken(res.access_token)),
      switchMap(() => this.http.get<string[]>(`${this.apiUrl}/me/sections`)),
      tap((sections) => this.setSections(sections))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/forgot`, { email });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.sectionsKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setSections(sections: string[]): void {
    localStorage.setItem(this.sectionsKey, JSON.stringify(sections));
  }

  getSections(): string[] {
    const raw = localStorage.getItem(this.sectionsKey);
    return raw ? JSON.parse(raw) : [];
  }

  hasSection(section: string): boolean {
    return this.getSections().includes(section);
  }
}