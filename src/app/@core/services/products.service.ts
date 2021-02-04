import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {createRequestOption} from '../../shares/utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {
  }

  query(): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/getAll`, {
      observe: 'response'
    });
  }

  doSearchByCode(id: any): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/products-size-color/${id}`, {
      observe: 'response'
    });
  }

  // public doSearch(req?: any, body?: any): Observable<any> {
  //   const options = createRequestOption(req);
  //   return this.http.post<any[]>(`${environment.apiUrl}/products/doSearch`, body, {
  //     params: options,
  //     observe: 'response'
  //   });
  // }

  public doSearch(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/products`, {
      params: options,
      observe: 'response'
    });
  }


  public doSearch1(req?: any, body?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any[]>(`${environment.apiUrl}/products/doSearch1`, body, {
      params: options,
      observe: 'response'
    });
  }

  public update(data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/products/update`, data, {
      observe: 'response'
    });
  }

  public insert(data: any): Observable<any> {
    return this.http.put <any>(`${environment.apiUrl}/products/insert`, data, {
      observe: 'response'
    });
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/products/${id}`);
  }

  public insertSizeColor(data: any): Observable<any> {
    return this.http.put <any>(`${environment.apiUrl}/productsSizeColor/insert`, data, {
      observe: 'response'
    });
  }

  deleteSizeColor(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/productsSizeColor/${id}`);
  }

}
