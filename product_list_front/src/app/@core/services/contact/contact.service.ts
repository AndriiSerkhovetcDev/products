import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Contact, DuplicateContacts} from "../../interfaces/contact";
import {forkJoin, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public restUrl = 'http://localhost:3000/contacts'
  constructor(private _http: HttpClient) { }


  public getContactsList(page: number): Observable<Contact[]> {
    return this._http.get<Contact[]>(this.restUrl, {params: {_page: page, _limit: 50}});
  }

  public addContact(contact: Contact): Observable<Contact> {
    return this._http.post<Contact>(this.restUrl, contact);
  }

  public updateContact(contact: Contact) {
    return this._http.patch(`${ this.restUrl }/${contact.id}`, contact)
  }

  public deleteContact(id: number) {
    return this._http.delete(`${ this.restUrl }/${ id }`);
  }

  public deleteRows(users: Contact[]): Observable<Contact[]> {
    return forkJoin(
      users.map((user) =>
        this._http.delete<Contact>(`${this.restUrl}/${user.id}`)
      )
    );
  }

  public getDuplicateObjectsIds(contacts: Contact[]): number[] {
    const duplicates: DuplicateContacts = contacts.reduce((acc: DuplicateContacts, obj: Contact) => {
      const key = `${obj.firstName}|${obj.lastName}`;
      acc[key] = acc[key] || [];
      acc[key].push(obj);
      return acc;
    }, {});

    const result: Contact[][] = Object.values(duplicates).filter((arr: Contact[]) => arr.length > 1);

    return result.flatMap((arr: Contact[]) => arr.map((item: Contact) => item.id)) || [];
  }

}
