import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService, DashboardSummary, Transaction } from '../../services/dashboard/dashboard.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  summary = {} as DashboardSummary;
  isLoading = true;

  // Loading específico para o novo gráfico
  isLoadingTrends = true;

  private translate = inject(TranslateService);
  private datePipe = inject(DatePipe);

  constructor(private dashboardService: DashboardService) { }

  // --- CONFIGURAÇÃO DO GRÁFICO DE ROSCA (Doughnut) ---
  pieChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6b7280'
        },
      }
    }
  };

  // --- CONFIGURAÇÃO DO GRÁFICO DE BARRAS (Trends) ---
  barChartType: 'bar' = 'bar';

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  ngOnInit() {
    this.dashboardService.getSummary().subscribe((res) => {
      this.summary = res.data;
      this.isLoading = false;
    });

    this.dashboardService.getCategorySummary().subscribe((res) => {
      const data = res.data;

      if (data) {
        this.pieChartData = {
          labels: data.map(d => d.category),
          datasets: [{
            data: data.map(d => d.totalAmount),
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#6366f1', '#f97316', '#a855f7', '#eab308', '#22c55e', '#f43f5e', '#8b5cf6', '#ec4899'],
            borderWidth: 1,
            borderColor: 'hsl(var(--background))'
          }]
        };
      }
      this.isLoading = false;
    });

    this.loadMonthlyTrends();
  }

  loadMonthlyTrends() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);

    const endDateStr = this.datePipe.transform(end, 'yyyy-MM-dd') || '';
    const startDateStr = this.datePipe.transform(start, 'yyyy-MM-dd') || '';

    this.dashboardService.getTransactionsHistory(startDateStr, endDateStr).subscribe({
      next: (res) => {
        const transactions: Transaction[] = res.data || res.data || [];

        this.processTrendData(transactions, start, end);
        this.isLoadingTrends = false;
      },
      error: () => {
        this.isLoadingTrends = false;
      }
    });
  }

  processTrendData(transactions: Transaction[], startDate: Date, endDate: Date) {
    const monthsMap = new Map<string, { income: number, expense: number, balance: number }>();

    let current = new Date(startDate);
    while (current <= endDate) {
      const key = this.datePipe.transform(current, 'MMM/yy');
      if (key) monthsMap.set(key, { income: 0, expense: 0, balance: 0 });
      current.setMonth(current.getMonth() + 1);
    }

    transactions.forEach(t => {
      const tDate = new Date(t.transactionDate);
      tDate.setDate(tDate.getDate() + 1);
      const key = this.datePipe.transform(tDate, 'MMM/yy');

      if (key && monthsMap.has(key)) {
        const data = monthsMap.get(key)!;
        if (t.type === 'DEPOSIT') {
          data.income += t.amount;
        } else if (t.type === 'WITHDRAW') {
          data.expense += t.amount;
        }
      }
    });

    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const balanceData: number[] = [];

    monthsMap.forEach((val, key) => {
      labels.push(key);
      incomeData.push(val.income);
      expenseData.push(val.expense);
      balanceData.push(val.income - val.expense);
    });

    this.barChartData = {
      labels: labels,
      datasets: [
        { data: incomeData, label: 'Receitas', backgroundColor: '#10b981', hoverBackgroundColor: '#059669' },
        { data: expenseData, label: 'Despesas', backgroundColor: '#ef4444', hoverBackgroundColor: '#dc2626' },
        { data: balanceData, label: 'Saldo', backgroundColor: '#3b82f6', hoverBackgroundColor: '#2563eb' }
      ]
    };
  }
}
