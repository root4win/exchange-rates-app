import { Injectable } from '@angular/core';
import { CurrencyResponse } from '../models/currency.model';
import { RateResponse } from '../models/rates.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  saveToCache(cacheKey:string, data: CurrencyResponse | RateResponse){
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }

  getFromCache(cacheKey: string): CurrencyResponse | RateResponse | null{
    const cachedData = localStorage.getItem(cacheKey);
    if(cachedData){
      return JSON.parse(cachedData);
    }

    return null;
  }
}
