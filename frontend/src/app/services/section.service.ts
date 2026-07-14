import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Section } from '../models/section.model';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sections`;

  getAll(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl);
  }
}