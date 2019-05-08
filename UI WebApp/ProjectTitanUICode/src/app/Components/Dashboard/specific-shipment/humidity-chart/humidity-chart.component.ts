import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ShipmentService } from '../../../../Services/Shipment Services/shipment.service';
// import { SpecificShipmentService } from '../../../../Services/Shipment Services/specific-shipment.service';
import * as _ from 'lodash';
import { Chart } from 'chart.js';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-humidity-chart',
  templateUrl: './humidity-chart.component.html',
  styleUrls: ['./humidity-chart.component.css']
})
export class HumidityChartComponent implements OnInit, AfterViewInit {
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
  public myLineChart;

  public startDate: string;
  public endDate: string;
  public MaxHumTime: string;
  public MinHumTime: string;
  public DefaultGetObject: any;

  maxHum: number;
  minHum: number;
  avgHum: number;

  @ViewChild('myChart') myChart;
  constructor(
    private _shipmentService: ShipmentService,
    private el: ElementRef,
    // private _specificShipmentService: SpecificShipmentService
  ) {
  
    this.startDate = moment(sessionStorage.getItem('CreatedTime'), 'YYYY-MM-DD').format();
    this.endDate = moment().format('YYYY-MM-DD');

    this.displayDefaultmsg = false;
    this.displayRangeSelector = false;

    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        rangeInputFormat: 'YYYY-MM-DD',
        outputFormat: 'YYYY-MM-DD',

      });


    this._shipmentService.GetBeaconId
      .subscribe(beaconId => {
        this.beaconId = beaconId;
        // console.log('humidity chart: ' + this.beaconId);
        this._shipmentService.GetHumidityGraph(this.beaconId)
          .subscribe(res => {
            // this.LineChartData = {};
            this.LineChartData = res['_body'];
            this.labels = [];
            this.data = [];

            let maxHumObject = (this._shipmentService.findMaxHum(JSON.parse(this.LineChartData)));
            let minHumObject = (this._shipmentService.findMinHum(JSON.parse(this.LineChartData)));
            this.maxHum = maxHumObject.humidity;
            this.MaxHumTime = maxHumObject.current_system_time;
            this.minHum = minHumObject.humidity;
            this.MinHumTime = minHumObject.current_system_time;
            this.avgHum = this._shipmentService.findAvgHum(JSON.parse(this.LineChartData));

            // tslint:disable-next-line:no-var-keyword
            // tslint:disable-next-line:prefer-const
            let item = JSON.parse(this.LineChartData);
            _.forEach(item, (obj) => {
              obj.x = new Date(obj.current_system_time).toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' });
              obj.y = obj.humidity;
              delete obj.humidity;
              delete obj.current_system_time;
              this.labels.push(obj.x);
              this.data.push(obj.y);
            });
            this.mychartfunction();
            // this._specificShipmentService.SendHumidityData(item);
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
    this._shipmentService.GetHumidityGraphByDate(JSON.stringify(this.getObject))
      .subscribe(res => {
        // console.log(res);
        // this.LineChartData = {};
        this.LineChartData = res['_body'];
        this.labels = [];
        this.data = [];

  
        let maxHumObject = (this._shipmentService.findMaxHum(JSON.parse(this.LineChartData)));
        let minHumObject = (this._shipmentService.findMinHum(JSON.parse(this.LineChartData)));
        this.maxHum = maxHumObject.humidity;
        this.MaxHumTime = maxHumObject.current_system_time;
        this.minHum = minHumObject.humidity;
        this.MinHumTime = minHumObject.current_system_time;
        this.avgHum = this._shipmentService.findAvgHum(JSON.parse(this.LineChartData));


        // tslint:disable-next-line:no-var-keyword
        // tslint:disable-next-line:prefer-const
        let item = JSON.parse(this.LineChartData);
        _.forEach(item, (obj) => {
          obj.x = new Date(obj.current_system_time).toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' });
          obj.y = obj.humidity;
          delete obj.humidity;
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
    // console.log('data humid', this.data);
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
              label: 'Humidity Chart',
              backgroundColor: '#b3e6ff',
              pointBorderWidth: 1,
              pointRadius: 0,
              lineTension: 0.5,

            }
          ],
        },

        borderColor: '#0099ff',
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
          },

        },
      });
    }
  }
}
