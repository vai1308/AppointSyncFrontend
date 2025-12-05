import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/appointments/';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

  updateAppointment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }
}
