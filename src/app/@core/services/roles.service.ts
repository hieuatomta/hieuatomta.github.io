import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {createRequestOption} from '../../shares/utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) {
  }

  public doSearch(req?: any, body?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any[]>(`${environment.apiUrl}/roles/getAllRole`, body, {
      params: options,
      observe: 'response'
    });
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/roles/update`, data, {
      observe: 'response'
    });
  }

  public insert(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/insert`, data, {
      observe: 'response'
    });
  }

  public delete(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/delete`, data, {
      observe: 'response'
    });
  }
}
