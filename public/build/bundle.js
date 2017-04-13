/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _this = this;

window.GooGleMap = (() => {
	_this.mapId = 'map';
	_this.calculateBtnId = 'calculate';
	_this.addressesId = 'addresses';
	_this.contentBlockId = 'distance';
	_this.map = null;
	_this.allMarkers = [];
	_this.maxMarkers = 2;
	_this.defaultOption = {
		center: { lat: 50.0589158, lng: 19.9507902 },
		zoom: 14
	};

	_this.addPlaceMarker = location => {
		var geocoder = new google.maps.Geocoder();
		var infowindow = new google.maps.InfoWindow();

		geocoder.geocode({ 'location': location }, (results, status) => {
			if (status === 'OK') {
				if (results[1]) {
					console.log(results[1]);
					infowindow.setContent(results[1].formatted_address);

					var marker = new google.maps.Marker({
						position: location,
						map: _this.map
					});

					marker.addListener('click', () => {
						infowindow.open(_this.map, marker);
					});

					_this.allMarkers.push(marker);
					_this.removingRedundantMarkers();
					_this.showContentBlock();
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}
		});
	};

	_this.getInfoMarker = () => {};

	_this.showContentBlock = () => {
		if (_this.allMarkers.length == _this.maxMarkers) {
			document.getElementById(_this.contentBlockId).style.display = 'block';
		}
	};

	_this.removingRedundantMarkers = () => {
		if (_this.allMarkers.length > _this.maxMarkers) {
			var deleteMarker = _this.allMarkers.shift();
			deleteMarker.setMap(null);
		}
	};

	_this.calculateDistance = () => {
		if (_this.validateCalculate()) {
			var service = new google.maps.DistanceMatrixService();

			service.getDistanceMatrix({
				origins: [_this.allMarkers[0].getPosition()],
				destinations: [_this.allMarkers[1].getPosition()],
				travelMode: 'DRIVING'
			}, (response, status) => {
				if (status == 'OK') _this.renderAddressTemplate(response);
			});
		}
	};

	_this.renderAddressTemplate = response => {
		const start = response.originAddresses[0];
		const end = response.destinationAddresses[0];
		const distance = response.rows[0].elements[0].distance.text;
		const template = `
			<p>Start: <b>${start}</b></p>
			<p>End: <b>${end}</b></p>
			<p>Distance:  <b>${distance}</b></p>
		`;

		document.getElementById(_this.addressesId).innerHTML = template;
	};

	_this.validateCalculate = () => {
		if (_this.allMarkers.length < _this.maxMarkers) return false;

		return true;
	};

	return {
		init: () => {
			_this.map = new google.maps.Map(document.getElementById(_this.mapId), _this.defaultOption);

			google.maps.event.addListener(_this.map, 'click', event => {
				console.log(event);
				_this.addPlaceMarker(event.latLng);
			});
		},
		events: () => {
			document.getElementById(_this.calculateBtnId).addEventListener("click", event => {
				_this.calculateDistance();
			});
		}
	};
})();

/***/ })
/******/ ]);