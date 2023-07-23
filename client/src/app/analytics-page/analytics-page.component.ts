import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Chart } from 'chart.js/auto'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy{

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  aSub!: Subscription
  average!: number
  pending = true

  constructor(private service: AnalyticsService) {}

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)',
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)',
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average =  data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** Gain ****
      // gainConfig.labels.push('27.06.2023')
      // gainConfig.labels.push('28.06.2023')
      // gainConfig.data.push(1500)
      // gainConfig.data.push(700)
      // **** /Gain ****

      // **** Order ****
      // orderConfig.labels.push('27.06.2023')
      // orderConfig.labels.push('28.06.2023')
      // orderConfig.data.push(8)
      // orderConfig.data.push(2)
      // **** /Order ****

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, {
        type: 'line',
        options: {
          responsive: true
        },
        data: {
          labels: gainConfig.labels,
          datasets: [
            {
              label: gainConfig.label,
              data: gainConfig.data,
              borderColor: gainConfig.color,
              fill: false
            }
          ]
        }
      })

      new Chart(orderCtx, {
        type: 'line',
        options: {
          responsive: true
        },
        data: {
          labels: orderConfig.labels,
          datasets: [
            {
              label: orderConfig.label,
              data: orderConfig.data,
              borderColor: orderConfig.color,
              fill: false
            }
          ]
        }
      })

      this.pending =  false
    })
  }

  ngOnDestroy(){
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}

// function createChartConfig(gainConfig) {
//   return {
//     type: 'line',
//     options: {
//       responsive: true
//     },
//     data: {
//       labels: gainConfig.labels,
//       datasets: [
//         {
//           label: gainConfig.label,
//           data: gainConfig.data,
//           borderColor: gainConfig.color,
//           steppedLine: false,
//           fill: false
//         }
//       ]
//     }
//   }
// }
