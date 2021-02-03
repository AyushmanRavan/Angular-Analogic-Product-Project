import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor() { }

  clearStorageItems() {
    localStorage.clear();
  }

  setStorageItem(key: string, value: string) {
    localStorage.removeItem(key); //removing allready existing item.
    localStorage.setItem(key, value);
  }

  getStorageItem(key: string) {
    return localStorage.getItem(key);
  }
  
  // let itemsArray = []
  // localStorage.setItem('items', JSON.stringify(itemsArray))
  // const data = JSON.parse(localStorage.getItem('items'))

  setComplexStorageItem(key: string, value: string) {
    localStorage.removeItem(key);//removing allready existing item.
    localStorage.setItem(key, JSON.stringify(value));
  }

  getComplexStorageItem(key: string) {
    return JSON.parse(localStorage.get(key));
  }


}
