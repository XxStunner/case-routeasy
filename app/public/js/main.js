(function () {
    /**
     * Leaflet
     */
    const rzmap = L.map('clients_map').setView([-23.5528115,-46.6121641], 11);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Routeasy Case',
        maxZoom: 11,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoieHhzdHVubmVyIiwiYSI6ImNqa3JwaWpvMDI2ZGgzcXFyOG40MngxY2EifQ.GBTaoIQhDDroi9zFDp-kZQ'
    }).addTo(rzmap);

    const rzMakers = L.layerGroup().addTo(rzmap);

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
            rzMakers.clearLayers();
            axios.get('/api/v1/deliveries')
                .then(res => {
                    res.data.map((d) => {
                        L.marker([d.address.location.lat, d.address.location.lng])
                            .addTo(rzMakers)
                            .bindPopup(`${d.client_name}<br />${d.size}`)
                        $scope.$apply(() => $scope.total_size += parseInt(d.size));
                    });
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
})();