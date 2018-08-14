(function () {
    /**
     * Angular.JS
     */
    const mainModule = angular.module('mainModule', []);

    mainModule.controller('main-controller', function($scope) {
        $scope.new_delivery = {
            client_name: '',
            size: '',
            address: {
                full_name: '',
                street_name: '',
                neighborhood: '',
                city: '',
                state: '',
                country: 'Brasil',
                location: {
                    lat: '',
                    lng: ''
                },
            }
        };

        $scope.deliveries = [];

        $scope.total_size = 0;
        $scope.medium_ticket = 0;

        /**
         * Get Deliveries.
         */
        $scope.getDeliveries = function() {
            axios.get('/api/v1/deliveries')
            .then(res => {
                $scope.$apply(() => $scope.deliveries = res.data);
            }).catch(err => console.log(err));
        }

        /**
         * Google Search.
         */
        $scope.search = function(address) {
            axios.get(`https://maps.google.com/maps/api/geocode/json?address=${address}&key=AIzaSyBbWBSeL1p-3w88cxFA7lWSI6GnvgasoFw&sensor=false&region=BR&language=pt-BR`)
            .then(res => {
                let r = res.data.results;
                if (r.length > 0) {
                    let address = r[0];
                    $scope.$apply(() => $scope.new_delivery.address.location = address.geometry.location);
                    address.address_components.map(c => {
                        c.types.map(t => {
                            switch(t) {
                                case 'route':
                                    $scope.$apply(() => $scope.new_delivery.address.street_name = c.short_name);
                                    break;
                                case 'sublocality':
                                    $scope.$apply(() => $scope.new_delivery.address.neighborhood = c.short_name);
                                    break;
                                case 'administrative_area_level_1':
                                    $scope.$apply(() => $scope.new_delivery.address.state = c.short_name);
                                    break;
                                case 'administrative_area_level_2':
                                    $scope.$apply(() => $scope.new_delivery.address.city = c.short_name);
                            }
                        });
                    });
                }
            }).catch(err => console.log(err));
        }
        
        /**
         * Submit Form.
         */
        $scope.submit = function() {
            axios.post('/api/v1/deliveries', $scope.new_delivery)
            .then(res => {
                if(res.data.success){
                    $scope.getDeliveries();
                    $scope.$apply(() => {
                        $scope.new_delivery = {
                            client_name: '',
                            size: '',
                            address: {
                                full_name: '',
                                street_name: '',
                                neighborhood: '',
                                city: '',
                                state: '',
                                country: 'Brasil',
                                location: {
                                    lat: '',
                                    lng: ''
                                },
                            }
                        }
                    });
                }
            }).catch(err => console.log(err));
        }
        
        /**
         * Reset the Database.
         */
        $scope.reset = function() {
            axios.delete('/api/v1/deliveries')
            .then(res => {
                if(res.data.success) $scope.getDeliveries();
            }).catch(err => console.log(err));
        }
        
        $scope.getDeliveries();
    });
    /**
     * Leaflet
     */
    let map = L.map('clients_map', {
        center: [51.505, -0.09],
        zoom: 13
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/streets-v9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieHhzdHVubmVyIiwiYSI6ImNqa3JwaWpvMDI2ZGgzcXFyOG40MngxY2EifQ.GBTaoIQhDDroi9zFDp-kZQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

})();