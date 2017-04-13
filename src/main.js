window.GooGleMap = (() => {
	this.mapId = 'map';
	this.calculateBtnId = 'calculate';
	this.addressesId = 'addresses';
	this.contentBlockId = 'distance';
	this.map = null;
	this.allMarkers = [];
	this.maxMarkers = 2;
	this.defaultOption = {
		center: {lat: 50.0589158, lng: 19.9507902},
		zoom: 14
	};

	this.addPlaceMarker = (location) => {
		var geocoder = new google.maps.Geocoder;
		var infowindow = new google.maps.InfoWindow;

		geocoder.geocode({'location': location}, (results, status) => {
		    if (status === 'OK') {
		      if (results[1]) {
		      	console.log(results[1]);
		      	infowindow.setContent(results[1].formatted_address);

		      	var marker = new google.maps.Marker({
				    position: location, 
				    map: this.map
				});

				marker.addListener('click', () => {
		          infowindow.open(this.map, marker);
		        });

				this.allMarkers.push(marker);
				this.removingRedundantMarkers();
				this.showContentBlock();
		      } else {
		        window.alert('No results found');
		      }
		    } else {
		      window.alert('Geocoder failed due to: ' + status);
		    }
		});
	};

	this.getInfoMarker = () => {

	};

	this.showContentBlock = () => {
		if(this.allMarkers.length == this.maxMarkers) {
			document.getElementById(this.contentBlockId).style.display = 'block';
		}
	};

	this.removingRedundantMarkers = () => {
		if(this.allMarkers.length > this.maxMarkers) {
			var deleteMarker = this.allMarkers.shift();
			deleteMarker.setMap(null);
		}
	};

	this.calculateDistance = () => {
		if(this.validateCalculate()) {
	        var service = new google.maps.DistanceMatrixService();

	        service.getDistanceMatrix(
	            {
	                origins: [this.allMarkers[0].getPosition()],
	                destinations: [this.allMarkers[1].getPosition()],
	                travelMode: 'DRIVING'
	            }, 
	            (response, status) => {
	              if(status == 'OK') this.renderAddressTemplate(response);
	            }
	        );
		}
	};

	this.renderAddressTemplate = (response) => {
		const start = response.originAddresses[0];
		const end = response.destinationAddresses[0];
		const distance = response.rows[0].elements[0].distance.text;
		const template = `
			<p>Start: <b>${start}</b></p>
			<p>End: <b>${end}</b></p>
			<p>Distance:  <b>${distance}</b></p>
		`;

		document.getElementById(this.addressesId).innerHTML = template;
	};

	this.validateCalculate = () => {
		if(this.allMarkers.length < this.maxMarkers) return false;

		return true;
	};

	return {
		init: () => {
			this.map = new google.maps.Map(document.getElementById(this.mapId), this.defaultOption);

			google.maps.event.addListener(this.map, 'click', (event) => {
				console.log(event);
				this.addPlaceMarker(event.latLng);
			});
		},
		events: () => {
			document.getElementById(this.calculateBtnId).addEventListener("click", ( event ) => {
				this.calculateDistance();
		    });
		}
	};
})();