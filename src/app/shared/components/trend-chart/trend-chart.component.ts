import { Component, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-trend-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="chart-shell">
      <canvas
        baseChart
        [type]="type()"
        [data]="chartData()"
        [options]="chartOptions"
      ></canvas>
    </div>
  `,
  styles: `
    .chart-shell {
      position: relative;
      min-height: 16rem;
    }
  `
})
export class TrendChartComponent {
  readonly labels = input.required<string[]>();
  readonly values = input.required<number[]>();
  readonly seriesLabel = input('Trend');
  readonly type = input<ChartType>('line');

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(120, 127, 148, 0.15)' },
        ticks: { callback: (value) => `${value}%` }
      },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue}%`
        }
      }
    }
  };

  chartData(): ChartConfiguration['data'] {
    return {
      labels: this.labels(),
      datasets: [
        {
          label: this.seriesLabel(),
          data: this.values(),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.22)',
          pointBackgroundColor: '#c2410c',
          pointBorderColor: '#fff',
          borderWidth: 2,
          fill: true,
          tension: 0.35
        }
      ]
    };
  }
}
