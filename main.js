import './style.css';
import {
  Map,
  View
} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
//import Map from 'ol/Map.js';
//import OSM from 'ol/source/OSM.js';
import TileJSON from 'ol/source/TileJSON.js';
//import View from 'ol/View.js';
import {
  Group as LayerGroup
} from 'ol/layer.js';
import {
  //useGeographic,
  addCoordinateTransforms,
  addProjection,
  transform,
  fromLonLat
} from 'ol/proj.js';
import Stamen from 'ol/source/Stamen.js';
import BingMaps from 'ol/source/BingMaps.js';
import {
  Control,
  ScaleLine,
  defaults as defaultControls
} from 'ol/control.js';
import {
  getRenderPixel
} from 'ol/render.js';
import MousePosition from 'ol/control/MousePosition.js';
import {
  createStringXY
} from 'ol/coordinate.js';
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';
import {
  Draw,
  Modify
} from 'ol/interaction.js';
import {
  Circle,
  LineString,
  Point
} from 'ol/geom.js';
import {
  getArea,
  getLength
} from 'ol/sphere.js';
import {
  Vector as VectorSource
} from 'ol/source.js';
import {
  Vector as VectorLayer
} from 'ol/layer.js';
//kml
//import KML from 'ol/format/KML.js';
import DragAndDrop from 'ol/interaction/DragAndDrop.js';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format.js';
import Feature from 'ol/Feature.js';

//geolocation
import Geolocation from 'ol/Geolocation.js';

import Overlay from 'ol/Overlay.js';
import {toStringHDMS} from 'ol/coordinate.js';
import Geocoder from "@kirtandesai/ol-geocoder";
 //import PdfPrinter from 'ol-pdf-printer';
 import WKT from 'ol/format/WKT.js';
let dragAndDropInteraction;
let selection = {};
let location_vector;
localStorage.setItem("infoStatus", "ON");
//useGeographic();
class HomeControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="bx bx-home-alt"></i>';

    const element = document.createElement('div');
    element.className = 'home-link ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleHomeLink.bind(this), false);
  }

  handleHomeLink() {
    //alert("Home Btn Clicked")
    //this.getMap().setView({center: [9502406.742993, 2677375.166725]});
    map.getView().setCenter([9502406.742993, 2677375.166725]);
  }
}

class ShowHideDataTable extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="bx bx-table"></i>';

    const element = document.createElement('div');
    element.className = 'ShowHideDataTable ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleClickEvent.bind(this), false);
  }

  handleClickEvent() {
    //this.getMap().getView().setRotation(0);
    if(document.getElementById("dataTableDiv").classList.contains("show")){
      document.getElementById("dataTableDiv").classList.remove("show");
    }
    else{
      document.getElementById("dataTableDiv").classList.add("show");
    }
    
  }
}
document.getElementById("hideTableDiv").onclick=function(){
  document.getElementById("dataTableDiv").classList.remove("show");
}
class RotateNorthControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'N';

    const element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleRotateNorth.bind(this), false);
  }

  handleRotateNorth() {
    this.getMap().getView().setRotation(0);
  }
}
class AddMeasureTool extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="far fa-ruler-combined"></i>';

    const element = document.createElement('div');
    element.className = 'custom-Measure ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleMeasure.bind(this), false);
  }

  handleMeasure() {
    //this.getMap().getView().setRotation(0);
    //startMeasureFunc()
    //addInteraction()
  }
}

class viewInfoTool extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="far fa-info-square"></i>';

    const element = document.createElement('div');
    element.className = 'custom-info ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleInfo.bind(this), false);
  }

  handleInfo() {
    //this.getMap().getView().setRotation(0);
    alert("Info ON");
    if (localStorage.getItem("infoStatus") === "ON") {
      localStorage.setItem("infoStatus", "OFF");
    } else {
      localStorage.setItem("infoStatus", "ON");
    }

  }
}

let LayerArrList = [];

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
});

function Progress(el) {
  this.el = el;
  this.loading = 0;
  this.loaded = 0;
}

/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
  ++this.loading;
  this.update();
};

/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
  ++this.loaded;
  this.update();
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
  const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
  this.el.style.width = width;
};

/**
 * Show the progress bar.
 */
Progress.prototype.show = function () {
  this.el.style.visibility = 'visible';
};

/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function () {
  const style = this.el.style;
  setTimeout(function () {
    style.visibility = 'hidden';
    //style.width = 0;
  }, 250);
};

const progress = new Progress(document.getElementById('progress'));

//Layers From Geoserver

const stateBoundary = new TileLayer({
  //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:State_Boundary_Jhar0',
      'TILED': true
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
    // Countries have transparency, so do not fade tiles:
    //transition: 0,
  }),
  visible: true,
  // preload: Infinity,
});
const districtBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': '	UAVDATA:District_Boundary_Jharkhand',
      'TILED': true
    },
    serverType: 'geoserver',crossOrigin: 'anonymous',
  }),
  visible: false,
});
const panchayatBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:Panchayat_20Boundary_Jharkhand',
      'TILED': true
    },
    serverType: 'geoserver',crossOrigin: 'anonymous',
  }),
  visible: false,
});
const villageBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:Village_Boundary_Jhar0',
      'TILED': true
    },
    serverType: 'geoserver',crossOrigin: 'anonymous',
  }),
  visible: false,
});


const view = new View({
  // projection: 'EPSG:4326',
  //center: [85.23, 23.81566],
  center: [9502406.742993, 2677375.166725],
  //center: fromLonLat([85.23, 23.81566]),
  //center: transform([85.23, 23.81566], 'EPSG:4326', 'EPSG:4326'),
  zoom: 7.5,
  //rotation: 1,
});
//used for shape to geojson 
let vectorSHPSource="";
let vectorSHPSourceLayer="";
const source = new VectorSource();

const vector = new VectorLayer({
  source: source,
  style: function (feature) {
    return styleFunction(feature, showSegments.checked);
  },
});

// var updateLegend = function (resolution) {
//   var graphicUrl = wmsSource.getLegendUrl(resolution);
//   var img = document.getElementById("legend");
//   img.src = graphicUrl;
// };

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
const map = new Map({
  controls: defaultControls().extend([
    // new ScaleLine({
    //   units: 'metric',
    // }),
    mousePositionControl,
    
    // new AddMeasureTool(),
    //new viewInfoTool()
    new HomeControl(),
    new ShowHideDataTable()
  ]),
  // controls: defaultControls().extend([new RotateNorthControl()]),
  layers: [

    new TileLayer({
      source: new OSM({
        crossOrigin: 'anonymous',
      }),
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        crossOrigin: 'anonymous',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',crossOrigin: 'anonymous',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',crossOrigin: 'anonymous',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',crossOrigin: 'anonymous',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: 'dY07ihXoIp15X3uz2p7u~XhaOOszGD1yRh0iA2siECg~ApUkGF8SU2HBMsmFOMX6wuknO-ehbjd919j8pD6Jg-fWqeJL97x3K3KtdApb7xTH',
        imagerySet: 'Aerial',
        crossOrigin: 'anonymous',
      }),
      visible: false,
      name: 'bingmaps'
    }),
    // for Admim layer groups: 
    new LayerGroup({
      layers: [
        stateBoundary,
        districtBoundary,
        panchayatBoundary,
        villageBoundary
      ],
    }),
    // vector,
  ],
  target: 'mapDiv',
  view: view,
  overlays: [overlay],

});

//map.addLayer(vector);
map.on('tileloadstart', function () {
  progress.addLoading();
});
map.on(['tileloadend', 'tileloaderror'], function () {
  progress.addLoaded();
});
map.on('loadstart', function () {
  map.getTargetElement().classList.add('spinner');
  progress.show();
});
map.on('loadend', function () {
  map.getTargetElement().classList.remove('spinner');
  progress.hide();
});

LayerArrList.push('0_stateBoundary');

// Layer Group - show hide layers on map
function bindInputs(layerid, layer) {
  var visibilityInput = $(layerid + ' input.visible');
  visibilityInput.on('change', function () {
    layer.setVisible(this.checked);
    if (this.dataset.layrname) {
      if (this.checked === true) {
        LayerArrList.push(this.dataset.layrname);
        console.log(LayerArrList)
      } else if (this.checked === false) {
        LayerArrList.splice(LayerArrList.indexOf(this.dataset.layrname), 1);
        //LayerArrList.pop(this.dataset.layrname);
        console.log(LayerArrList)
      }
    }
  });

  visibilityInput.prop('checked', layer.getVisible());
  // if(layer.getVisible()){
  //   console.log("this");
  // }
  var opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input change', function () {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}
map.getLayers().forEach(function (layer, i) {
  bindInputs('#layer' + i, layer);
  if (layer instanceof LayerGroup) {
    layer.getLayers().forEach(function (sublayer, j) {
      bindInputs('#layer' + i + j, sublayer);
    });
  }
});


//geocoding services
var geocoder = new Geocoder('nominatim', {
  provider: 'osm',
  lang: 'en',
  placeholder: 'Search for ...',
  limit: 5,
  debug: false,
  autoComplete: true,
  keepOpen: true
});
map.addControl(geocoder);
document.getElementById('geocodeBtn').onclick= function(){
  console.log("Sfsdsdfsdf");
  let element = document.getElementsByClassName("gcd-gl-control")[0];
  element.classList.toggle("gcd-gl-expanded");
  document.getElementById('gcd-input-query').focus();
}

document.getElementById('geocodeClearBtn').onclick=function(){
  geocoder.getSource().clear();
  content.innerHTML ="";
  container.style.display = "none";
  map.removeLayer(location_vector);
  map.getView().setCenter([9502406.742993, 2677375.166725]);
  map.getView().animate({
    zoom: 7.5,
    duration: 250
  });
}
// //Listen when an address is chosen
geocoder.on('addresschosen', function (evt) {
	console.info(evt);
  var feature = evt.feature,
      coord = evt.coordinate,
      address = evt.address;
  geocoder.getSource().clear();
  geocoder.getSource().addFeature(feature);
  // some popup solution
  content.innerHTML = '<p>'+ address.formatted +'</p>';
  overlay.setPosition(coord);


  // window.setTimeout(function () {
  //   popup.show(evt.coordinate, evt.address.formatted);
  // }, 1000);
});

//swiper code
// const swipe = document.getElementById('swipe');
// //if(swipe.style.display!="none"){
//   stateBoundary.on('prerender', function (event) {
//     const ctx = event.context;
//     const mapSize = map.getSize();
//     const width = mapSize[0] * (swipe.value / 100);
//     const tl = getRenderPixel(event, [width, 0]);
//     const tr = getRenderPixel(event, [mapSize[0], 0]);
//     const bl = getRenderPixel(event, [width, mapSize[1]]);
//     const br = getRenderPixel(event, mapSize);

//     ctx.save();
//     ctx.beginPath();
//     ctx.moveTo(tl[0], tl[1]);
//     ctx.lineTo(bl[0], bl[1]);
//     ctx.lineTo(br[0], br[1]);
//     ctx.lineTo(tr[0], tr[1]);
//     ctx.closePath();
//     ctx.clip();
//   });

//   stateBoundary.on('postrender', function (event) {
//     const ctx = event.context;
//     ctx.restore();
//   });

//   swipe.addEventListener('input', function () {
//     map.render();
//   });
// //}



// function bindInputs(layerid, layer, i) {
//   const visibilityInput = $(layerid + ' input.visible');
//   visibilityInput.on('change', function () {
//     layer.setVisible(this.checked);
//   });
//   if(i===0){
//     visibilityInput.prop('checked', true);
//   }
//   else{
//     //layer.getVisible() retrurn true /false
//     visibilityInput.prop('checked', );
//   }


//   const opacityInput = $(layerid + ' input.opacity');
//   opacityInput.on('input', function () {
//     layer.setOpacity(parseFloat(this.value));
//   });
//   opacityInput.val(String(layer.getOpacity()));
// }
// function setup(id, group) {
//   group.getLayers().forEach(function (layer, i) {
//     const layerid = id + i;
//     bindInputs(layerid, layer,i);
//     if (layer instanceof LayerGroup) {
//       setup(layerid, layer);
//     }
//   });
// }
// setup('#layer', map.getLayerGroup());

///get map data on click

//get featured info by clicking on map
//let tableString = "<div id='hideTableDiv'><i class='bx bx-window-close' ></i></div>";
//document.getElementById('tblDiv').innerHTML += tableString;


map.on('singleclick', async function (evt) {
  localStorage.setItem("infoStatus", "ON");
  if (localStorage.getItem("infoStatus") === "ON") {
    console.log(map);
    let clickedPoint4326 = coord3857To4326(evt.coordinate);
    console.log(clickedPoint4326);
    map.getTargetElement().classList.add('spinner');
    progress.show();
    document.getElementById('info').innerHTML = '';
    document.getElementById('info').innerHTML = "Clicked Mouse Location : <br/>" + evt.coordinate[0] + ", " + evt.coordinate[1];
    // evt.pixel;
    console.log(evt.coordinate);

    const viewResolution = /** @type {number} */ (view.getResolution());
    //let url ='http://localhost:8880/geoserver/UAVDATA/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=application/json&TRANSPARENT=true&QUERY_LAYERS=UAVDATA:State_Boundary_Jhar0&STYLES&LAYERS=UAVDATA:State_Boundary_Jhar0&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=100&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&BBOX=84.40905768214726%2C22.985595336416733%2C85.51867682277226%2C24.095214477041733';

    document.getElementById('tblDiv').innerHTML = "";
    let tableString = "";
    
    //LayerArrList.forEach((lyr, i) => {
    for (var i = 0; i < LayerArrList.length; i++) {
      let lyrId = LayerArrList[i].split("_");
      //map.getLayers().array_[6].values_.layers.array_[0].sourceChangeKey_.target.params_.LAYERS;
      let lyrXX = map.getLayers().array_[6].values_.layers.array_[i];
      const url = lyrXX.getSource().getFeatureInfoUrl(
        //evt.coordinate,
        clickedPoint4326,
        viewResolution,
        'EPSG:4326', {
          'INFO_FORMAT': 'application/json'
        }
      );
      if (url) {
        await fetch(url)
          .then((response) => response.text())
          .then((html) => {
            let dataString = JSON.parse(html);
            content.innerHTML =   populatePopupContent(dataString);  
            if (dataString.features.length > 0) {
              let dataStringX = dataString.features[0].properties;
              let dataKeys = Object.keys(dataStringX);
              //let tableString="";
              if (dataKeys.length > 5) {
                tableString += "<h4>" + lyrId[1].toUpperCase() + "</h4>"
                tableString += "<table id='tableData' class='table table-sm table-bordered'>";
                tableString += "<tr>";
                for (var j = 0; j < dataKeys.length; j++) {
                  tableString += "<td>" + dataKeys[j].toUpperCase() + "</td>";
                }
                tableString += "</tr>";
                for (var i = 0; i < dataString.features.length; i++) {
                  tableString += "<tr>";
                  for (let j = 0; j < dataKeys.length; j++) {
                    tableString += "<td>" + dataString.features[0].properties[dataKeys[j]] + "</td>";
                  }
                }
                tableString += "</tr>";
                tableString += "</table>";
              }


              // map.getTargetElement().classList.remove('spinner');
              //progress.hide();
              //map.zoomToExtent(bounds,closest);

              //  dataString.getFeatures()[0].getGeometry())
              //view.fit(dataString.getFeatures()[0].getGeometry());
            }
            map.getTargetElement().classList.remove('spinner');
            progress.hide();

          });
      }
    }
    //content.innerHTML =   populatePopupContent();                 //'<p>You clicked here:</p><code>' + clickedPoint4326 + '</code>'+tableString;
    overlay.setPosition(evt.coordinate);
    document.getElementById('tblDiv').innerHTML += tableString;
    $("#attrData").show();
  } else {
    map.getTargetElement().classList.remove('spinner');
    progress.hide();
  }

});

//lat long of pointer move on map
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const data = stateBoundary.getData(evt.pixel);
  const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
  //document.getElementById('info').innerHTML = evt.pixel;
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';

});

console.log(LayerArrList);
// show layer options - show hide / opacity
$('#layertree li > span').click(function () {
  $(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();

//measurement code
////////////////////////////////measure codes////////////////////////////////////////////////
const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

const labelStyle = new Style({
  text: new Text({
    font: '14px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
  }),
});

const tipStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
  text: new Text({
    text: 'Drag to modify',
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
});
let tipPoint;
const segmentStyles = [segmentStyle];

const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2';
  }
  return output;
};
let typeSelect = document.getElementById('Measurementtype');
let showSegments = document.getElementById('Measurementsegments');
let clearPrevious = document.getElementById('Measurementclear');

function addInteraction() {
  const drawType = typeSelect.value;
  const activeTip =
    'Click to continue drawing the ' +
    (drawType === 'Polygon' ? 'polygon' : 'line');
  const idleTip = 'Click to start measuring';
  let tip = idleTip;
  draw = new Draw({
    source: source,
    type: drawType,
    style: function (feature) {
      return styleFunction(feature, showSegments.checked, drawType, tip);
    },
  });
  draw.on('drawstart', function () {
    if (clearPrevious.checked) {
      source.clear();
    }
    modify.setActive(false);
    tip = activeTip;
  });
  draw.on('drawend', function () {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once('pointermove', function () {
      modifyStyle.setGeometry();
    });
    tip = idleTip;
  });
  modify.setActive(true);
  map.addInteraction(draw);
}

function styleFunction(feature, segments, drawType, tip) {
  const styles = [style];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;
  if (!drawType || drawType === type) {
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }
  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }
  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
    if (styles.length > 0) {
      //document.getElementById("measurementLength").innerHTML="";
      //let measTxt =  styles(styles.length-1);
      document.getElementById("measurementLength").innerHTML = label;
    }
  }
  // console.log(styles);


  if (
    tip &&
    type === 'Point' &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }
  return styles;
}
const modify = new Modify({
  source: source,
  style: modifyStyle
});
let draw;

if ($("#startMeasure").length) {
  document.getElementById("startMeasure").onclick = function () {
    alert("dfsssdfsd")
    localStorage.setItem("infoStatus", "OFF");
    map.addLayer(vector);
    map.addInteraction(modify);
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };
    addInteraction();
    showSegments.onchange = function () {
      vector.changed();
      draw.getOverlay().changed();
    };
  }
}
if ($("#EndMeasure").length) {
  document.getElementById("EndMeasure").onclick = function () {
    alert("EndMeasure")
    map.removeInteraction(draw);

    map.getLayers().array_[7].getSource().clear();
    //map.getLayers().array_[7].getSource().getSource().clear();
    map.removeLayer(vector);
    localStorage.setItem("infoStatus", "ON");
  }
}
//on hover map shows data of feature
// const mapInfostatus = document.getElementById('mapInfostatus');
// const selectStyle = new Style({
//   fill: new Fill({
//     color: '#eeeeee',
//   }),
//   stroke: new Stroke({
//     color: 'rgba(255, 255, 255, 0.7)',
//     width: 2,
//   }),
// });
// let selected = null;
// map.on('pointermove', function (e) {
//   if (selected !== null) {
//     selected.setStyle(undefined);
//     selected = null;
//   }

//   map.forEachFeatureAtPixel(e.pixel, function (f) {
//     selected = f;
//     selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
//     f.setStyle(selectStyle);
//     return true;
//   });

//   if (selected) {
//     mapInfostatus.innerHTML = selected.get('ECO_NAME');
//   } else {
//     mapInfostatus.innerHTML = '-';
//   }
// });

//kml
document.getElementById('selectKMLfile').addEventListener('change', (event) => {
  var file = document.getElementById("selectKMLfile").files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function () {
      const vector = new VectorLayer({
        source: new VectorSource({
          url: reader.result,
          format: new KML()
        }),
        style: new Style({
          fill: new Fill({
            color: 'blue',
          }),
          stroke: new Stroke({
            color: 'blue',
            width: '2pt',
          }),
        })
      });
      map.addLayer(vector);
      let kmlFeatures = "";
      vector.getSource().on('addfeature', function () {
        map.getView().fit(vector.getSource().getExtent());
        setTimeout(function () {
          kmlFeatures = vector.getSource().getFeatures();
          let dataString = kmlFeatures; //vector.getSource().getFeatures();
          let dataStringX = dataString[0].values_;
          let dataKeys = Object.keys(dataStringX);
          let tableString = "";
          if (dataKeys.length > 0) {
            tableString += "<h4> KML File Data</h4>"
            tableString += "<table id='tableData' class='table table-sm table-bordered'>";
            tableString += "<tr>";
            for (var j = 0; j < dataKeys.length; j++) {
              tableString += "<td>" + dataKeys[j].toUpperCase() + "</td>";
            }
            tableString += "</tr>";
            for (var i = 0; i < dataString.length; i++) {
              tableString += "<tr>";
              for (let j = 0; j < dataKeys.length; j++) {
                tableString += "<td>" + dataString[0].values_[dataKeys[j]] + "</td>";
              }
            }
            tableString += "</tr>";
            tableString += "</table>";
          }
          document.getElementById('tblDiv').innerHTML += tableString;
          $("#dataTableDiv").show();
          console.log(vector.getSource().getFeatures()[0].values_.name);
        }, 500);
        localStorage.setItem("infoStatus", "OFF");
      });
    }
    reader.readAsDataURL(file);

  }
});
const extractStyles = document.getElementById('extractstyles');
function setdragAndDropInteraction() {
  if (dragAndDropInteraction) {
    map.removeInteraction(dragAndDropInteraction);
  }
  dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [
      GPX,
      GeoJSON,
      IGC,
      // use constructed format to set options
      new KML({extractStyles: extractStyles.checked}),
      TopoJSON,
    ],
  });
  dragAndDropInteraction.on('addfeatures', function (event) {
    // let fileExtn = event.file.name.split(".");
    // if(fileExtn[1]==='zip'){
    //    alert("Please use Shapefile Upload Control !!");
    // }
    // else{
      const vectorSource = new VectorSource({
        features: event.features,
      });
      map.addLayer(
        new VectorLayer({
          source: vectorSource,
        })
      );
      map.getView().fit(vectorSource.getExtent());
    //}     
  });
  map.addInteraction(dragAndDropInteraction);
}
setdragAndDropInteraction();
const displayFeatureInfo = function (pixel) {
  const features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    const info = [];
    let i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get('name'));
    }
    document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
  } else {
    document.getElementById('info').innerHTML = '&nbsp;';
  }
};
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  if(vectorSHPSource){
    localStorage.setItem("infoStatus", "OFF");
    // let itemKey = Object.keys(vectorSHPSource.featuresRtree_.items_);
      
    //       for (let j = 0; j < itemKey.length; j++) {
    //         vectorSHPSource.featuresRtree_.items_[itemKey[j]].value.setStyle(new Style({
    //             // fill: new Fill({
    //             //   color: 'red',
    //             // }),
    //             stroke: new Stroke({
    //               color: 'purple',
    //               width: '2pt',
    //             }),
    //           }))
    //       } 
 
    
    let singleClickedFeature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      // console.log(feature);
      // feature.setStyle(new Style({
      //   // fill: new Fill({
      //   //   color: 'red',
      //   // }),
      //   stroke: new Stroke({
      //     color: 'green',
      //     width: '3pt',
      //   }),
      // }));
      


      return feature;
    });
    singleClickedFeature.setStyle( new Style({
      // fill: new Fill({
      //   color: 'red',
      // }),
      stroke: new Stroke({
        color: 'green',
        width: '3pt',
      }),
    }));
    if(singleClickedFeature){
      document.getElementById('tblDiv').innerHTML = "";
          let tableString = "<table id='tableData' class='table table-sm table-bordered'>";  
          let fieldname = Object.keys(singleClickedFeature.values_);
          tableString += "<tr>";
            for (var j = 0; j < fieldname.length; j++) {
              tableString += "<th>" + fieldname[j].toUpperCase() + "</th>";
            }
            tableString += "</tr>";
            //feature.values_.forEach(feature => {
                  tableString += "<tr>";
                  for (let j = 0; j < fieldname.length; j++) {
                    tableString += "<td>" + singleClickedFeature.values_[fieldname[j]] + "</td>";
                  }           
                tableString += "</tr>";
                
             // }); 
              tableString += "</table>";
              document.getElementById('tblDiv').innerHTML += tableString;
              ///$("#dataTableDiv").show();
    }
    map.getView().fit(singleClickedFeature.getGeometry());  
    
  }
  else{
    displayFeatureInfo(evt.pixel);
  }
  
});

document.getElementById('selectSHPfile').addEventListener('change', (event) => {
  var zipfile = document.getElementById("selectSHPfile").files[0];
  if (zipfile) {
    localStorage.setItem("infoStatus", "OFF");
    var reader = new FileReader();
    reader.onload = function () {
      let fileExtn = zipfile.name.split(".");
      if (fileExtn[1] === 'zip') { 
          const file = zipfile;
          loadshp({
            url: file,
            encoding: 'utf-8'
          }, function (geojson) {
            const features = new GeoJSON().readFeatures(
              geojson, {
                featureProjection: map.getView().getProjection()
              }
            );
            vectorSHPSource = new VectorSource({
              features: features,
            });
            vectorSHPSourceLayer = new VectorLayer({
              source: vectorSHPSource,
            });
            map.addLayer(vectorSHPSourceLayer);
            map.getView().fit(vectorSHPSource.getExtent());
            document.getElementById('tblDiv').innerHTML = "";
            let tableString = "<table id='tableData' class='table table-sm table-bordered'>";  
            let fieldname = Object.keys(geojson.features[0].properties);
            tableString += "<tr>";
              for (var j = 0; j < fieldname.length; j++) {
                tableString += "<th>" + fieldname[j].toUpperCase() + "</th>";
              }
              tableString += "</tr>";
                geojson.features.forEach(feature => {
                    tableString += "<tr>";
                    for (let j = 0; j < fieldname.length; j++) {
                      tableString += "<td>" + feature.properties[fieldname[j]] + "</td>";
                    }           
                  tableString += "</tr>";
                  
                }); 
                tableString += "</table>";
                document.getElementById('tblDiv').innerHTML += tableString;
                $("#dataTableDiv").show();
          });
        } 
    }
    reader.readAsDataURL(zipfile);

  }
})

document.getElementById('removeOnFLyData').onclick=function() {
  map.removeLayer(vector);
  vectorSHPSource="";
  map.removeLayer(vectorSHPSourceLayer);
  localStorage.setItem("infoStatus", "ON");
  document.getElementById('tblDiv').innerHTML = "";
                $("#dataTableDiv").hide();
};

function coord3857To4326(coord) {
    
  const e_value = 2.7182818284;
  const X = 20037508.34;
  
  const lat3857 = coord[1]
  const long3857 = coord[0];
  
  //converting the longitute from epsg 3857 to 4326
  const long4326 = (long3857*180)/X;
  
  //converting the latitude from epsg 3857 to 4326 split in multiple lines for readability        
  let lat4326 = lat3857/(X / 180);
  const exponent = (Math.PI / 180) * lat4326;
  
  lat4326 = Math.atan(Math.pow(e_value, exponent));
  lat4326 = lat4326 / (Math.PI / 360); // Here is the fixed line
  lat4326 = lat4326 - 90;
  return [long4326,lat4326];
  //return {lat:lat4326, lng:long4326};
  
}

//geolocation section

const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

function el(id) {
  return document.getElementById(id);
}

el('track').addEventListener('change', function () {
  geolocation.setTracking(this.checked);
});

// update the HTML page when the position changes.
geolocation.on('change', function () {
  el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
  el('altitude').innerText = geolocation.getAltitude() + ' [m]';
  el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
  el('heading').innerText = geolocation.getHeading() + ' [rad]';
  el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
});

// handle geolocation error.
geolocation.on('error', function (error) {
  const info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
);

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});

function populatePopupContent(featureData){
let contentBox = '<div class="accordion" id="accordionExample">';
contentBox += '<div class="accordion-item">';
contentBox += '  <h2 class="accordion-header" id="headingOne">';
contentBox += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">';
contentBox += 'Accordion Item #1 ';
contentBox += '</button>';
contentBox += '</h2>';
contentBox += '<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">';
contentBox += '<div class="accordion-body">';
contentBox += '<strong>This is the first items accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. Its also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.';
contentBox += '</div>';
contentBox += '</div>';
contentBox += '</div>';
contentBox += '<div class="accordion-item">';
contentBox += '<h2 class="accordion-header" id="headingTwo">';
contentBox += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">';
contentBox += 'Accordion Item #2';
contentBox += '</button>';
contentBox += '</h2>';
contentBox += '<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">';
contentBox += '<div class="accordion-body">';
contentBox += '<strong>This is the second item\'s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It\'s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.';
contentBox += '    </div>';
contentBox += '</div>';
contentBox += '</div>';
contentBox += '<div class="accordion-item">';
contentBox += '<h2 class="accordion-header" id="headingThree">';
contentBox += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">';
contentBox += 'Accordion Item #3';
contentBox += '</button>';
contentBox += '</h2>';
contentBox += '<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">';
contentBox += '<div class="accordion-body">';
contentBox += '<strong>This is the third item\'s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It\'s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.';
contentBox += '    </div>';
contentBox += '</div>';
contentBox += '</div>';
contentBox += '</div>';
  
 return contentBox;

let box11= '<ul class="nav nav-tabs" id="myTab" role="tablist"><li class="nav-item" role="presentation">  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button></li><li class="nav-item" role="presentation">  <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button></li><li class="nav-item" role="presentation">  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button></li><li class="nav-item" role="presentation">  <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button></li></ul><div class="tab-content" id="myTabContent"><div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">home...</div><div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">profile...</div><div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">contact...</div><div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">disabled........................</div></div>';
//return box11;




}

const raster = new TileLayer({
  source: new OSM(),
});

import {getPointResolution, get as getProjection} from 'ol/proj.js';
const scaleLine = new ScaleLine({bar: true, text: true, minWidth: 125});
map.addControl(scaleLine);
const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

const exportOptions = {
  useCORS: true,
  ignoreElements: function (element) {
    const className = element.className || '';
    return (
      className.includes('ol-control') &&
      !className.includes('ol-scale') &&
      (!className.includes('ol-attribution') ||
        !className.includes('ol-uncollapsible'))
    );
  },
};
const exportButton = document.getElementById('export-pdf');

exportButton.addEventListener(
  'click',
  function () {
   // map.addLayer(raster);
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';

    const format = document.getElementById('format').value;
    const resolution = document.getElementById('resolution').value;
    const scale = document.getElementById('scale').value;
    const dim = dims[format];
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const viewResolution = map.getView().getResolution();
    const size = map.getSize();
    // const scaleResolution =
    //   scale /
    //   getPointResolution(
    //     map.getView().getProjection(),
    //     resolution / 25.4,
    //     map.getView().getCenter()
    //   );
    map.once('rendercomplete', function () {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            const transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);
      
// let scaleprint = html2canvas(document.getElementsByClassName("ol-scale-bar"), {allowTaint: true, useCORS:true}).then(function (canvas) {document.getElementsByClassName("ol-scale-bar").append(canvas)});
     // html2canvas(map.getViewport(), { useCORS:true}).then(function (canvas) {
        const pdf = new jspdf.jsPDF('landscape', undefined, format);
        pdf.addImage(
          mapCanvas.toDataURL('image/jpeg'),
          'JPEG',
          0,
          0,
          dim[0],
          dim[1]
        );
        var img = document.getElementById("legend");
        console.log(img)
        pdf.addImage(img, "JPEG", 10, dim[1] - (img.height*0.5)-10, (img.width*0.5), (img.height*0.5));
        pdf.text(10, 10, 'GIS Map - JSAC');
        pdf.text(10, 20, 'GIS Map 11- JSAC11');
        // pdf.addImage(scaleprint,'JPEG',(10+ (img.width*0.5)),0,scaleprint.width,scaleprint.height);
        //pdf.text(10, 20, 'GIS Map 11- JSAC11');
        //pdf.addImage("GIS Map - JSAC", "JPEG", 0, dim[1] - img.height-20, img.width, img.height);
        pdf.save('map.pdf');
        exportButton.disabled = false;
        document.body.style.cursor = 'auto';
      });

      scaleLine.setDpi(resolution);
     const printSize = [width, height];
    map.setSize(printSize);
    const scaling = Math.min(width / size[0], height / size[1]);
    map.getView().setResolution(viewResolution);
 
  },
  false
);

// var resolution = map.getView().getResolution();
// updateLegend(resolution);

// // Update the legend when the resolution changes
// map.getView().on("change:resolution", function (event) {
//   var resolution = event.target.getResolution();
//   updateLegend(resolution);
// });


document.getElementById('setToHome').onclick=function(){
  map.getView().setCenter([9502406.742993, 2677375.166725]);
}

// function exportPdf() {

// var opt_options = {
//   language: 'en',
//   //i18n: {...}, // Custom translations. Default is according to selected language
//   filename: 'Ol Pdf Printer',
//   units: 'metric',
//   style: {
//       paperMargin: 10,
//       brcolor: '#000000',
//       bkcolor: '#273f50',
//       txcolor: '#ffffff'
//   },
//   extraInfo: {
//       date: true,
//       url: true,
//       scale: true
//   },
//   mapElements: {
//       description: true,
//       attributions: true,
//       scalebar: true,
//       compass: './assets/images/compass.svg'
//   },
//   watermark: {
//       title: 'Ol Pdf Printer',
//       titleColor: '#d65959',
//       subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
//       subtitleColor: '#444444',
//       logo: false
//   },
//   paperSizes: [
//       { size: [594, 420], value: 'A2' },
//       { size: [420, 297], value: 'A3' },
//       { size: [297, 210], value: 'A4', selected: true },
//       { size: [210, 148], value: 'A5' }
//   ],
//   dpi: [
//       { value: 72 },
//       { value: 96 },
//       { value: 150, selected: true },
//       { value: 200 },
//       { value: 300 }
//   ],
//   scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
//   mimeTypeExport: [
//       { value: 'pdf', selected: true},
//       { value: 'png' },
//       { value: 'jpeg' },
//       { value: 'webp' }
//   ],
//   dateFormat: undefined, // Use browser default
//   ctrlBtnClass: '',
//   modal: {
//       animateClass: 'fade',
//       animateInClass: 'show',
//       transition: 300,
//       backdropTransition: 150,
//       templates: {
//           dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
//           headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>`
//       }
//   }
// }
//   let pdfPrinter = new PdfPrinter(opt_options);

//   map.addControl(pdfPrinter);

// }
//exportPdf(map);

function convert4326_3587Coordinates(lon, lat) {
  var x = (lon * 20037508.34) / 180;
  var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return [x, y];
}

document.getElementById("dname").onchange = function(){
 // alert($(this).val())

 //console.log(convert4326_3587Coordinates(85.259,23.569));
 // map.getView().setCenter(convert4326_3587Coordinates(85.259,23.569));
 if($(this).val()!=""){
  distzoom($(this).val(),"",true);
 }
 else
 {
  map.getView().setCenter([9502406.742993, 2677375.166725]).setZoom(6.5);
  alert("Zoom to All District")
  //distzoom(document.getElementById("dname").value,"",true);
 }

}
document.getElementById("bname").onchange = function(){
  // alert($(this).val())
 
  //console.log(convert4326_3587Coordinates(85.259,23.569));
  // map.getView().setCenter(convert4326_3587Coordinates(85.259,23.569));
  if($(this).val()!=""){
   distzoom($(this).val(),"",true);
  }
  else
  {
   alert("Zoom to Parent District")
   distzoom(document.getElementById("dname").value,"",true);
  }
 
 }
 document.getElementById("pname").onchange = function(){
  // alert($(this).val())
 
  //console.log(convert4326_3587Coordinates(85.259,23.569));
  // map.getView().setCenter(convert4326_3587Coordinates(85.259,23.569));
  if($(this).val()!=""){
   distzoom($(this).val(),"",true);
  }
  else
  {
   alert("Zoom to Parent Block")
   distzoom(document.getElementById("bname").value,"",true);
  }
 
 }
 document.getElementById("vname").onchange = function(){
  // alert($(this).val())
 
  //console.log(convert4326_3587Coordinates(85.259,23.569));
  // map.getView().setCenter(convert4326_3587Coordinates(85.259,23.569));
  if($(this).val()!=""){
   distzoom($(this).val(),"",true);
  }
  else
  {
   alert("Zoom to Parent Panchayat")
   distzoom(document.getElementById("pname").value,"",true);
  }
 
 }
let vectorsDataLyrs;
function distzoom(dist_vector,dist_lab,flag)
{
 
  if(vectorsDataLyrs){
    map.removeLayer(vectorsDataLyrs);
  }

    let parser = new WKT();
    const feature = parser.readFeature(dist_vector,{dataProjection: 'EPSG:4326',featureProjection: 'EPSG:3857'});
    
    vectorsDataLyrs = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      style: new Style({
        fill: new Fill({
          color: '#ffffcc82',
        }),
        stroke: new Stroke({
          color: 'red',
          width: '3pt',
        }),
      })
    });
    map.addLayer(vectorsDataLyrs);

    const geometry = feature.getGeometry();
    map.getView().fit(geometry, map.getSize(), {duration: 1000});
    //var extent = vectorsDataLyrs.getSource().getExtent();
    //map.getView().fitExtent(extent, map.getSize());              
}
///////////////Lat Long Place on MAP////////////////////////
document.getElementById("latlongMap").onclick=function(){
  let lat = document.getElementById("lats").value;
  let long = document.getElementById("longs").value;
  let locAr = []
  locAr.push(long);
  locAr.push(lat);
  
  console.log(locAr.map(Number))
  // console.log(convert4326_3587Coordinates(long,lat));
  if(lat && long){
    console.log("Making Maker")
    //map.getView().setCenter([9502406.742993, 2677375.166725]);
   // map.setView(new View({center:[9499633.537198717, 2676413.3235116196],zoom: 14.5}))
 
       // const place =[85.2365663,23.2256245];
    console.log(proj4("EPSG:4326", "EPSG:3857", [85.2365663,23.2256245]));
        const point = new Point(proj4("EPSG:4326", "EPSG:3857", locAr.map(Number)));
        
        console.log(point);
          
        map.removeLayer(location_vector);      
        location_vector= new VectorLayer({
          source: new VectorSource({
            features: [new Feature(point)], 
          }),
          style: {
            'circle-radius': 9,
            'circle-fill-color': 'red',
          } 
        }); 
        map.addLayer(location_vector);
      map.getView().setCenter(proj4("EPSG:4326", "EPSG:3857",locAr.map(Number)));
        map.getView().animate({
          zoom: 15,
          duration: 250
        })
  }
  else{
    alert("Lat/Long Missing")
  }
  
}

/////////// DMS Lat Long on MAP //////////////////////
document.getElementById("latlongDMSMap").onclick = function () {
  alert("sfdsfsdfsdsdf");
  if(document.getElementById("ltDegree") && document.getElementById("ltMinutes") && document.getElementById("ltSeconds") && document.getElementById("latdirection") && document.getElementById("lnDegree") && document.getElementById("lnMinutes") && document.getElementById("lnSeconds") && document.getElementById("lngdirection") )
  {
    let ltdegree = parseFloat(document.getElementById("ltDegree").value);
    let ltminutes = parseFloat(document.getElementById("ltMinutes").value);
    let ltseconds =  parseFloat(document.getElementById("ltSeconds").value);
    let latdir =  document.getElementById("latdirection").value;
    let lndegree =  parseFloat(document.getElementById("lnDegree").value);
    let lnminutes = parseFloat(document.getElementById("lnMinutes").value);
    let lnseconds =  parseFloat(document.getElementById("lnSeconds").value);
    let londir =  document.getElementById("lngdirection").value;
    let lat = ConvertDMSToDD(ltdegree,ltminutes,ltseconds,latdir);
    let lng = ConvertDMSToDD(lndegree,lnminutes,lnseconds,londir);
    let locAr = []
    locAr.push(lng);
    locAr.push(lat);
    const point = new Point(proj4("EPSG:4326", "EPSG:3857", locAr.map(Number)));
        
        console.log(point);
          
        map.removeLayer(location_vector);      
        location_vector= new VectorLayer({
          source: new VectorSource({
            features: [new Feature(point)], 
          }),
          style: {
            'circle-radius': 9,
            'circle-fill-color': 'red',
          } 
        }); 
        map.addLayer(location_vector);
      map.getView().setCenter(proj4("EPSG:4326", "EPSG:3857",locAr.map(Number)));
        map.getView().animate({
          zoom: 15,
          duration: 250
        })
  }
  else{
    alert("DMS Input Missing !!")
  }
}
// function ParseDMS(input) {
//   var parts = input.split(/[^\d\w\.]+/);    
//   var lat = ConvertDMSToDD(parts[0], parts[2], parts[3], parts[4]);
//   var lng = ConvertDMSToDD(parts[5], parts[7], parts[8], parts[9]);

//   return {
//       Latitude : lat,
//       Longitude: lng,
//       Position : lat + ',' + lng
//   }
// }


function ConvertDMSToDD(degrees, minutes, seconds, direction) {   
  var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

  if (direction == "S" || direction == "W") {
      dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}