import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/tutorial.model';
import {environment} from "environment";

const baseUrl = `${environment.apiEndpoint}/api/tutorials`;

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(baseUrl);
  }

  get(id: any): Observable<Item> {
    return this.http.get<Item>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  deletePhoto(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}/photo`);
  }

  updateWithFile(id: string, data: FormData): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Item[]> {
    return this.http.get<Item[]>(`${baseUrl}?title=${title}`);
  }
}
