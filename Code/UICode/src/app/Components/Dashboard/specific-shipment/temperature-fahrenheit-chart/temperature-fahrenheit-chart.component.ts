import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
// import { SpecificShipmentService } from '../../../../Services/Shipment Services/specific-shipment.service';
import * as _ from 'lodash';
import { Chart } from 'chart.js';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-temperature-fahrenheit-chart',
  templateUrl: './temperature-fahrenheit-chart.component.html',
  styleUrls: ['./temperature-fahrenheit-chart.component.css']
})
export class TemperatureFahrenheitChartComponent implements OnInit, AfterViewInit  {

 //  Date Range
 DateRange: string[] = [];
 displayDefaultmsg: boolean;
 datePickerConfig: Partial<BsDatepickerConfig>;
 displayRangeSelector: boolean;
 fromDate: string;
 toDate: string;
 temp: string;
 tempTo: string;
 tempFrom: string;
 getObject: any;

  beaconId: string;
  jsonRes: any;
  public LineChartData;
  public canvas;
  public ctx: CanvasRenderingContext2D;
  public chartData;
  public labels = [];
  public data = [];
  public timeFormat = 'lll';
  public myLineChart;

  public startDate: string;
  public endDate: string;
  public MaxTempTime: string;
  public MinTempTime: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;


  public DefaultGetObject: any;
  constructor(
    private _shipmentService: ShipmentService,
    // private _specificShipmentService: SpecificShipmentService,
    private el: ElementRef
  ) {
    this.startDate = moment(sessionStorage.getItem('CreatedTime'), 'YYYY-MM-DD').format();
    this.endDate = moment().format('YYYY-MM-DD');


    this.displayDefaultmsg = false;
    this.displayRangeSelector = false;

    this.datePickerConfig = Object.assign({},
  {
     containerClass: 'theme-orange',
     showWeekNumbers: false,
     rangeInputFormat: 'YYYY/MM/DD'

    });

    this._shipmentService.GetBeaconId
    .subscribe(beaconId => {
      this.beaconId = beaconId;
      this._shipmentService.GetTemperatureGraph(this.beaconId)
      .subscribe(res => {
        this.LineChartData = res['_body'];
        
        // tslint:disable-next-line:no-var-keyword
        // tslint:disable-next-line:prefer-const
        this.labels = [];
        this.data = [];

        let maxTempObject = (this._shipmentService.findMaxTemp(JSON.parse(this.LineChartData)));
        let minTempObject = (this._shipmentService.findMinTemp(JSON.parse(this.LineChartData)));
        this.maxTemp = maxTempObject.temperature * 1.8 + 32;
        this.MaxTempTime = maxTempObject.current_system_time;
        this.minTemp = minTempObject.temperature * 1.8 + 32;
        this.MinTempTime = minTempObject.current_system_time;
        this.avgTemp = this._shipmentService.findAvgTemp(JSON.parse(this.LineChartData)) * 1.8 + 32;

        // tslint:disable-next-line:prefer-const
        let item = JSON.parse(this.LineChartData);
        _.forEach(item, (obj) => {
          obj.x = new Date(obj.current_system_time).toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' });
          obj.y = obj.temperature * 1.8 + 32;
          delete obj.temperature;
          delete obj.current_system_time;
          this.labels.push(obj.x);
          this.data.push(obj.y);
        });
        this.mychartfunction();
        // this._specificShipmentService.SendTemperatureData(item);
      });
    });

   }

   toggler() {
    if (this.displayRangeSelector === true) {
      this.displayRangeSelector = false;
    } else {
      this.displayRangeSelector = true;
    }
  }

  updateGraph() {
    // Forming From_Date and To_Date String
    this.fromDate = this.DateRange[0];
    this.toDate = this.DateRange[1];

    // From Date
    this.temp = moment(this.fromDate, 'YYYY-MM-DD').format();
    this.fromDate = this.temp.substring(0, 10);
    // To Date
    this.temp = moment(this.toDate, 'YYYY-MM-DD').format();
    this.toDate = this.temp.substring(0, 10);

  //  Object Creation
this.getObject = {
  BeaconId: this.beaconId,
  FromDate: this.fromDate,
  ToDate: this.toDate
};

// Calling API
    this._shipmentService.GetTemperatureGraphByDate(JSON.stringify(this.getObject))
    .subscribe(res => {
      // console.log(res);
      // this.LineChartData = {};
      this.LineChartData = res['_body'];
      this.labels = [];
      this.data = [];
    
      let maxTempObject = (this._shipmentService.findMaxTemp(JSON.parse(this.LineChartData)));
      let minTempObject = (this._shipmentService.findMinTemp(JSON.parse(this.LineChartData)));
      this.maxTemp = maxTempObject.temperature  * 1.8 + 32;
      this.MaxTempTime = maxTempObject.current_system_time;
      this.minTemp = minTempObject.temperature  * 1.8 + 32;
      this.MinTempTime = minTempObject.current_system_time;
      this.avgTemp = this._shipmentService.findAvgTemp(JSON.parse(this.LineChartData)) * 1.8 + 32;

      // tslint:disable-next-line:no-var-keyword
      // tslint:disable-next-line:prefer-const
      let item = JSON.parse(this.LineChartData);
      _.forEach(item, (obj) => {
        obj.x = new Date(obj.current_system_time).toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' });
        obj.y = obj.temperature * 1.8 + 32;
        delete obj.temperature;
        delete obj.current_system_time;
        this.labels.push(obj.x);
        this.data.push(obj.y);
      });
      this.mychartfunction();
      // this._specificShipmentService.SendHumidityData(item);
    });
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mychartfunction();
  }
  mychartfunction() {
    if ((this.data.length > 0) && (this.labels.length > 0)) {
     this.canvas = this.el.nativeElement.querySelector('#myChart');
      this.ctx = this.canvas.getContext('2d');
      this.myLineChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.data,
              fill: true,
              label: 'Temperature Chart',
              backgroundColor: '#ffd9b3',
              pointRadius: 0,
              lineTension: 0.5,
            }
          ],
        },
        borderColor: '#cc0000',
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  'millisecond': 'MMM DD',
                  'second': 'MMM DD',
                  'minute': 'MMM DD',
                  'hour': 'MMM DD',
                  'day': 'MMM DD',
                  'week': 'MMM DD',
                  'month': 'MMM DD',
                  'quarter': 'MMM DD',
                  'year': 'MMM DD',
                }
              },
    ticks: {
                autoSkip: true,
                maxTicksLimit: 4
              }
            }],
            yAxes: [{
              autoSkip: true,
              maxTicksLimit: 15
            }],
          }
        }
      });
    }
  }

}
