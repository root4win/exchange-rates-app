export interface RateResponse{
  date: string;
  base: string;
  rates: {
    [currencyCode: string]: string;
  }
}
