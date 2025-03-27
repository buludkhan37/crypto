import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { ExchangeApiService } from './exchange.api.service';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-exchange-widget',
    standalone: true,
    imports: [NgForOf, FormsModule, ScrollingModule, NgClass, AsyncPipe, DecimalPipe, NgIf],
    templateUrl: './exchange-widget.component.html',
    styleUrl: './exchange-widget.component.scss',
})
export class ExchangeWidgetComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    exchanges = ['Binance', 'Bybit', 'OKX'];
    selectedExchange = 'Binance';

    isServerTime = false;
    exchangeServerTime = '14:05:44';
    now = new Date();
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    formattedTimeZone = formatInTimeZone(this.now, this.timezone, 'HH:mm:ss');
    instruments$: Observable<any[]> | undefined;
    filter$ = new BehaviorSubject<string>('');
    filteredInstruments$!: Observable<any[]>;
    filterText = '';
    noInstrumentsFound = false;

    constructor(
        private api: ExchangeApiService,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit() {
        this.instruments$ = this.api.instruments$;
        this.api
            .getAllInstruments()
            .pipe(takeUntil(this.destroy$))
            .subscribe(instruments => {});

        this.filteredInstruments$ = combineLatest([this.api.instruments$, this.filter$]).pipe(
            map(([instruments, filter]) =>
                instruments.filter(inst =>
                    inst.symbol.toLowerCase().includes(filter.toLowerCase()),
                ),
            ),
        );
    }

    get displayedTime(): string {
        return this.isServerTime ? this.exchangeServerTime : this.formattedTimeZone;
    }

    toggleTIme(isServer: boolean) {
        this.isServerTime = isServer;
    }

    trackBySymbol(index: number, item: any): string {
        return item.symbol;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
