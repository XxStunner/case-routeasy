/**
 * Load .env
 */
require('dotenv').config();

/**
 * IMPORTS
 */
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

/**
 * Library for testing with mongoose.
 */
require('sinon-mongoose');

/**
 * Model "Delivery"
 */
const Delivery = require('../db/models/Delivery');

/**
 * Test the GET Method.
 */
describe("GET all the deliveries", () => {
    /**
     * [MongoDB] Test will be successful if find all deliveries.
     */
    it("[MongoDB] Should return all deliveries", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: true, todo: []};
        DeliveryMock.expects('find').yields(null, expectedResult);
        Delivery.find((err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    /**
     * [MongoDB] Test will be successful if fails to find a delivery.
     */
    it("[MongoDB] Should return error", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: false, error: "Something went wrong"};
        DeliveryMock.expects('find').yields(expectedResult, null);
        Delivery.find((err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });

    /**
     * [Express] Test will be successful if the route: (GET) /api/v1/deliveries returns: 200.
     */
    // it("[Express] Should return a response code of 200 at: (GET) /api/v1/deliveries", (done) => {
    //     request(app)
    //         .get(`/api/v1/deliveries`)
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end((err, res) => {
    //             if(err) return done(err);
    //             done();
    //         });
    // });
});

/**
 * Test the POST Method.
 */
describe("POST a delivery", () => {
    /**
     * [MongoDB] Test will be successful if the delivery is deleted.
     */
    it("[MongoDB] Should post a delivery", (done) => {
        let DeliveryMock = sinon.mock(new Delivery({
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
        }));
        let delivery = DeliveryMock.object;
        let expectedResult = { status: true };
        DeliveryMock.expects('save').yields(null, expectedResult);
        delivery.save((err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    
    /**
     * [MongoDB] Test will be successful if fails to delete a delivery.
     */
    it("[MongoDB] Should return error if the creation of a delivery fail", (done) => {
        let DeliveryMock = sinon.mock(new Delivery({
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
        }));
        let delivery = DeliveryMock.object;
        let expectedResult = { status: false };
        DeliveryMock.expects('save').yields(expectedResult, null);
        delivery.save((err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });

    /**
     * [Express] Test will be successful if the route: (POST) /api/v1/deliveries returns: 200.
     */
    // it("[Express] Should return a response code of 200 at: (POST) /api/v1/deliveries", (done) => {
    //     request(app)
    //         .get(`/api/v1/deliveries`)
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end((err, res) => {
    //             if(err) return done(err);
    //             done();
    //         });
    // });
});

/**
 * Test the DELETE Method.
 */
describe("Delete a delivery by id", () => {
    /**
     * [MongoDB] Test will be successful if the delivery is deleted.
     */
    it("[MongoDB] Should delete a delivery by id", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: true};
        DeliveryMock.expects('remove').withArgs({_id: 123}).yields(null, expectedResult);
        Delivery.remove({_id: 123},  (err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    
    /**
     * [MongoDB] Test will be successful if fails to delete a delivery.
     */
    it("[MongoDB] Should return error if delete action is failed", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: false};
        DeliveryMock.expects('remove').withArgs({_id: 123}).yields(expectedResult, null);
        Delivery.remove({_id: 123}, (err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });

    /**
     * [Express] Test will be successful if the route: (DELETE) /api/v1/deliveries/:id returns: 200.
     */
    // it("[Express] Should return a response code of 200 at: (DELETE) /api/v1/deliveries", (done) => {
    //     request(app)
    //         .del(`/api/v1/deliveries/123`)
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end((err, res) => {
    //             if(err) return done(err);
    //             done();
    //         });
    // });
});