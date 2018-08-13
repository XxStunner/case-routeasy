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
                street_name: '',
                number: '',
                neighborhood: '',
                complement: '',
                city: '',
                state: '',
                country: '',
                location: {
                    lat: '',
                    lng: ''
                },
            }
        };

        $scope.deliveries = [
            {
                client_name: 'Victor Dias',
                size: '20',
                address: {
                    street_name: 'Av. Cangaíba',
                    number: 2349,
                    neighborhood: 'Cangaíba',
                    complement: 'Próximo a padaria',
                    city: 'São Paulo',
                    state: 'SP',
                    country: 'Brasil',
                    location: {
                        lat: '-23.506889',
                        lng: '-46.5351526'
                    },
                },
            }
        ];

        $scope.total_size = 0;
        $scope.medium_ticket = 0;

        $scope.search = function(address) {
            axios.get(`https://maps.google.com/maps/api/geocode/json?address=${address}&key=AIzaSyBbWBSeL1p-3w88cxFA7lWSI6GnvgasoFw&sensor=false&region=BR&language=pt-BR`)
            .then(res => {
                console.log(res);
            }).catch(err => console.log(err));
        }

        $scope.submit = function () {

        }
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


    /**
     * Google Search
     */
})();