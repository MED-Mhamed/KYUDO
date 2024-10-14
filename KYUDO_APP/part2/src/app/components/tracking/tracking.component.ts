import { Component, OnInit, inject } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Firestore, doc, onSnapshot, DocumentReference, docSnapshots } from '@angular/fire/firestore';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString';
import { } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/compat/database';

declare var $: any;
declare var ol: any;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],

  providers: [Geolocation,]
})
export class TrackingComponent implements OnInit {
  transparent: 'transparent'
  vectorSource: any;
  vectorLayer: any;
  map: any;
  currentPos: any = [0, 0]
  constructor(private geolocation: Geolocation, private db: AngularFireDatabase
  ) { }


  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPos = [resp.coords.longitude, resp.coords.latitude];
      this.getdataRealTime()
    }).catch((error) => {
      console.error('Error getting location', error);
    });



  }
  getdataRealTime() {
    this.db.object('/').valueChanges().subscribe((data: any) => {
      this.fonctionMap(this.currentPos, data)
    });
  }
  fonctionMap(currentPos, position) {
    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
    var styles = {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 4, color: 'red'
        })
      }),
      icon: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          opacity: 1,
          scale: 0.05,
          src: '/assets/img/marker.png'
        })
      })
    };

    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([currentPos[0], currentPos[1]]),
        zoom: 11
      })
    });

    var points = [
      [currentPos[0], currentPos[1]], // device position
      [position.lat, position.lng]  // position from realtime database
    ];


    var utils = {
      createFeature: function (coord, type) {
        var iconSrc = (type === 'first') ? '/assets/img/marker.png' : '/assets/img/car.png';
        var feature = new ol.Feature({
          type: 'place',
          geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
          name: coord[0] + '/' + coord[1]
        });
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            opacity: 1,
            scale: 0.05,
            src: iconSrc
          })
        }));
        vectorSource.addFeature(feature);
      },
      createRoute: function (polyline) {
        var route = new ol.format.Polyline({
          factor: 1e5
        }).readGeometry(polyline, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        var feature = new ol.Feature({
          type: 'route',
          geometry: route
        });
        feature.setStyle(styles.route);
        vectorSource.addFeature(feature);
      }
    };

    // Create features for the stated points
    utils.createFeature(points[0], 'first');
    utils.createFeature(points[1], 'second');
    // points.forEach((point, i) => {
    //   utils.createFeature(point, i);
    // });
    console.log('points[0]', points[0]);
    console.log('points[1]', points[1]);

    // Get route between the two points
    var point1 = points[0].join();
    var point2 = points[1].join();

    fetch('//router.project-osrm.org/route/v1/driving/' + point2 + ';' + point1)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.code === 'Ok') {
          utils.createRoute(json.routes[0].geometry);
        } else {
          console.error('Error fetching route:', json);
        }
      })
      .catch(function (error) {
        console.error('Error fetching route:', error);
      });
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    var overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    map.addOverlay(overlay);
    if (closer) {
      closer.onclick = function () {
        overlay.setPosition(undefined);
        // closer.blur();
        return false;
      };
    }
    map.on('click', function (evt) {
      var coordinate = evt.coordinate;
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var name = feature.get('name');
        overlay.setPosition(coordinates);
        console.log('overlay', overlay);
        console.log('coordinates', coordinates);
        if (content) {

          content.innerHTML = '<p style="padding-top:10px"><b> Position:</b> ' + name + '</p>';

        }
      }
    });

  }
}
