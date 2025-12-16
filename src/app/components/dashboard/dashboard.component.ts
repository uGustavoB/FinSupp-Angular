import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService, DashboardSummary } from '../../services/dashboard/dashboard.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  summary = {} as DashboardSummary;
  isLoading = true;

  private translate = inject(TranslateService);

  constructor(private dashboardService: DashboardService) { }


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
          color: '#6b7280' // Tailwind gray-500
        },

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
      console.log(res);
      this.pieChartData = {
        labels: data.map(d => d.category),
        datasets: [{
          data: data.map(d => d.totalAmount),
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#6366f1', '#f97316', '#a855f7', '#eab308', '#22c55e', '#f43f5e', '#8b5cf6', '#ec4899'],
          borderWidth: 1,
          borderColor: 'hsl(var(--background))'
        }]
      };
      this.isLoading = false;
    });
  }
}
