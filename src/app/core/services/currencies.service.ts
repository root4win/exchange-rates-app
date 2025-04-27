import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
import { CurrencyResponse } from '../models/currency.model';
import { CacheService } from './cache.service';
import { environment } from '../../environment/environment';
import { RateResponse } from '../models/rates.model';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  private apiKey = environment.apiKey;
  private currenciesListKey = environment.CURRENCIES_LIST_KEY;
  private currenciesRatesKey = environment.CURRENCIES_RATES_KEY;
  private cachedCurrenciesList: CurrencyResponse | null = null;
  private cachedCurrenciesRates: RateResponse | null = null;

  currenciesList: Observable<CurrencyResponse> | null = null ;
  currenciesRates: Observable<RateResponse> | null = null;

  constructor(
    private apiService: ApiService,
    private cacheService: CacheService
  ){
    const currenciesList = this.cacheService.getFromCache(this.currenciesListKey);
    if(currenciesList) {
      this.cachedCurrenciesList = currenciesList as CurrencyResponse;
    }

    const currenciesRates = this.cacheService.getFromCache(this.currenciesRatesKey);
    if(currenciesRates) {
      this.cachedCurrenciesRates = currenciesRates as RateResponse;
    }
  }


  fetchSupportedCurrencies(): Observable<CurrencyResponse>{
    if(this.cachedCurrenciesList){
      return of(this.cachedCurrenciesList);
    }

    if(this.currenciesList){
      return this.currenciesList;
    }


    this.currenciesList =  this.apiService.get<CurrencyResponse>('supported-currencies').pipe(
      catchError(err => {
        console.error(`error while fetching all the currencies available: <${err}>`);
        throw err;
      }),
      tap( listData => {

        this.cacheService.saveToCache( this.currenciesListKey, listData );
      }),
      shareReplay(1),
      finalize(() => {
        this.currenciesList = null;
      })
    );

    return this.currenciesList;
  }

  fetchRates(): Observable<RateResponse> {
    if(this.cachedCurrenciesRates){
      return of(this.cachedCurrenciesRates);
    }

    if(this.currenciesRates){
      return this.currenciesRates;
    }


    this.currenciesRates =  this.apiService.get<RateResponse>('rates/latest?apikey=','',this.apiKey).pipe(
      catchError(err => {
        console.error(`error while fetching all the currencies available: <${err}>`);
        throw err;
      }),
      tap( listData => {
        this.cacheService.saveToCache(this.currenciesRatesKey, listData);
      }),
      shareReplay(1),
      finalize(() => {
        this.currenciesRates = null;
      })
    );
    return this.currenciesRates;
  }

  convertCurrencies( amount:number, fromCurrency: string, toCurrency: string): string {
    if (!this.cachedCurrenciesRates) {
      return 'N/A';
    }


    const fromCurrencyValue = this.cachedCurrenciesRates.rates[fromCurrency];
    const toCurrencyValue = this.cachedCurrenciesRates.rates[toCurrency];



    if (fromCurrencyValue === undefined || toCurrencyValue === undefined) {
      return 'N/A';
    }

    const fromValue = parseFloat(fromCurrencyValue);
    const toValue = parseFloat(toCurrencyValue);

    if (isNaN(fromValue) || isNaN(toValue) || fromValue === 0) {
      return 'N/A';
    }

    const result = (amount / fromValue) * toValue;
    return result.toFixed(4);
  }

}
