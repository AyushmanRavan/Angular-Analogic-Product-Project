import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor() { }

  clearStorage() {
    localStorage.clear();
  }

  saveStorage(key: string, value: string) {
    localStorage.removeItem(key); //removing allready existing item.
    localStorage.setItem(key, value);
  }

  getStorage(key: string) {
    return localStorage.getItem(key);
  }
  
  // let itemsArray = []
  // localStorage.setItem('items', JSON.stringify(itemsArray))
  // const data = JSON.parse(localStorage.getItem('items'))

  saveComplexStorage(key: string, value: string) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  getComplexStorage(key: string) {
    return JSON.parse(localStorage.get(key));
  }


}
