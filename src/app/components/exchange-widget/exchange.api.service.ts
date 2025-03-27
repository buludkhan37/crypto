import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

interface ExchangeInstrumentsList {
    symbol: string;
    price: number;
    volume: string;
    priceChangePercent: number;
    highPrice: number;
    lowPrice: number;
    serverTime: number;
}

@Injectable({
    providedIn: 'root',
})
export class ExchangeApiService {
    private BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/24hr'; // url для получения данных с binance
    instrumentSubject = new BehaviorSubject<any[]>([]);
    instruments$ = this.instrumentSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllInstruments(): Observable<ExchangeInstrumentsList[]> {
        return this.http.get<any[]>(this.BINANCE_API_URL).pipe(
            map(data =>
                data.slice(0, 1000).map(instrument => ({
                    symbol: instrument.symbol,
                    price: instrument.lastPrice,
                    volume: this.formatValue(instrument.volume),
                    priceChangePercent: instrument.priceChangePercent,
                    highPrice: instrument.highPrice,
                    lowPrice: instrument.lowPrice,
                    serverTime: instrument.openTime,
                })),
            ),
            tap(instruments => this.instrumentSubject.next(instruments)),
        );
    }

    private formatValue(volume: string): string {
        const num = parseInt(volume);

        if (num > 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num > 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num > 1e3) return (num / 1e3).toFixed(1) + 'K';

        return num.toFixed(1);
    }
}
