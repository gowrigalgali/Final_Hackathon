import React, { useEffect } from 'react';
import Head from 'next/head';

const GoogleMap = () => {
    useEffect(() => {
        const initMap = () => {
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: { lat: 39.8283, lng: -98.5795 } // Center of the US
            });
            const geocoder = new google.maps.Geocoder();
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const updateMap = () => {
                const source = document.getElementById('source').value;
                const destination = document.getElementById('destination').value;
                const waypoint = document.getElementById('waypoint').value;

                if (source && destination && waypoint) {
                    calculateAndDisplayRoute(source, destination, waypoint);
                } else {
                    alert('Please enter source, destination, and waypoint.');
                }
            };

            const calculateAndDisplayRoute = (source, destination, waypoint) => {
                directionsService.route(
                    {
                        origin: source,
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING
                    },
                    (response, status) => {
                        if (status === 'OK') {
                            const directRoute = response.routes[0];

                            geocoder.geocode({ address: waypoint }, function (results, status) {
                                if (status === 'OK') {
                                    const waypointLocation = results[0].geometry.location;
                                    const isWithinDistance = google.maps.geometry.spherical.computeDistanceBetween(
                                        directRoute.overview_path[Math.floor(directRoute.overview_path.length / 2)],
                                        waypointLocation
                                    ) <= 5000;

                                    if (isWithinDistance) {
                                        directionsService.route(
                                            {
                                                origin: source,
                                                destination: destination,
                                                waypoints: [{ location: waypointLocation, stopover: true }],
                                                travelMode: google.maps.TravelMode.DRIVING
                                            },
                                            (response, status) => {
                                                if (status === 'OK') {
                                                    directionsRenderer.setDirections(response);
                                                    const route = response.routes[0].legs;
                                                    let totalDistance = 0;
                                                    let totalDuration = 0;
                                                    route.forEach(leg => {
                                                        totalDistance += leg.distance.value;
                                                        totalDuration += leg.duration.value;
                                                    });
                                                    document.getElementById('results').innerHTML =
                                                        '<b>Total Distance:</b> ' + (totalDistance / 1000).toFixed(2) + ' km<br>' +
                                                        '<b>Total Duration:</b> ' + Math.floor(totalDuration / 3600) + ' hrs ' +
                                                        Math.floor((totalDuration % 3600) / 60) + ' mins';
                                                } else {
                                                    alert('Directions request failed due to ' + status);
                                                }
                                            }
                                        );
                                    } else {
                                        document.getElementById('results').innerHTML = 'Waypoint is out of the way.';
                                    }
                                } else {
                                    alert('Geocode was not successful for the following reason: ' + status);
                                }
                            });
                        } else {
                            alert('Directions request failed due to ' + status);
                        }
                    }
                );
            };

            document.getElementById('updateMapButton').addEventListener('click', updateMap);
        };

        if (typeof google !== 'undefined') {
            initMap();
        } else {
            window.initMap = initMap;
        }
    }, []);

    return (
        <>
            <Head>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8Em1y-G9d8YwfV_PYr4d6gBihdhVri-8&callback=initMap" async defer></script>
            </Head>
            <div>
                <h3>My Google Map</h3>
                <div id="inputs">
                    <label htmlFor="source">Source: </label>
                    <input type="text" id="source" name="source" />
                    <label htmlFor="destination">Destination: </label>
                    <input type="text" id="destination" name="destination" /><br />
                    <label htmlFor="waypoint">Waypoint: </label>
                    <input type="text" id="waypoint" name="waypoint" />
                    <button id="updateMapButton">Update Map</button>
                </div>
                <div id="map" style={{ height: '70vh', width: '100%' }}></div>
                <div id="results"></div>
            </div>
        </>
    );
};

export default GoogleMap;
