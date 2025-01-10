import {
  CartesianScaleTypeRegistry,
  Chart,
  ChartData,
  ScaleOptionsByType
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { ElementRef } from "@angular/core";

export function createLineChart(canvas: ElementRef,
                                dimensions: { width: number, height: number },
                                labels: string[],
                                data: number[],
                                xLabels: string[],
                                yLabels: string[]): Chart {
  canvas.nativeElement.width = dimensions.width
  canvas.nativeElement.height = dimensions.height
  let ctx = canvas.nativeElement.getContext('2d')!;

  let chartData: ChartData<"line", number[], string> = {
    labels: labels,
    datasets: [{
      backgroundColor: '#CF5CD1',
      borderColor: '#CF5CD1',
      data: data,
      cubicInterpolationMode: 'monotone',
    }],
  }

  let scales: _DeepPartialObject<{   [key: string]: ScaleOptionsByType<"radialLinear" | keyof CartesianScaleTypeRegistry>; }>= {
    y: {
      display: false,
      suggestedMin: 0,
      suggestedMax: 100,
    },
    x: {
      display: false,
      grid: {
        display: false
      },
    },
    myScale: {
      type: 'category',
      position: 'left',
      labels: yLabels,
      border: {
        display: false
      },
      ticks: {
        color: '#B8BAC1',
        font: {
          weight: 500,
          family: 'Roboto'
        }
      }
    },
    myScale2: {
      type: 'category',
      position: 'bottom',
      labels: xLabels,
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#B8BAC1'
      }
    }
  }

  let plugins = {
    legend: {
      display: false,
    },
    title: {
      display: false
    },
  }

  let elements = {
    point: {
      radius: 0,
    },
  }

  return new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      scales: scales,
      plugins: plugins,
      elements: elements,
    },
  })
}
