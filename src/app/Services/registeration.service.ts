import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterationService {
   
  constructor(private _http:HttpClient) { }
  addEmployee(data:any): Observable<any>{
    return this._http.post(`http://localhost:3000/registered`,data);
  }
  getEmployee():Observable<any>{
      return this._http.get<any>(`http://localhost:3000/registered`);   
  }
  updateByEmployee(id:any,data:any):Observable<any>{
    return this._http.patch<any>(`http://localhost:3000/registered/${id}`,data);
  }
  getByEmployeeId(id:any){
    return this._http.get(`http://localhost:3000/registered/${id}`);   
}

}
