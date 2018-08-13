const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

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
     * Test will be successful if find all deliveries.
     */
    it("should return all deliveries", (done) => {
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
     * Test will be successful if fails to find a delivery.
     */
    it("should return error", (done) => {
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
});

/**
 * Test the POST Method.
 */
describe("POST a delivery", () => {
    /**
     * Test will be successful if the delivery is deleted.
     */
    it("should post a delivery", (done) => {
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
     * Test will be successful if fails to delete a delivery.
     */
    it("should return error if the creation of a delivery fail", (done) => {
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
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

/**
 * Test the DELETE Method.
 */
describe("Delete a delivery by id", () => {
    /**
     * Test will be successful if the delivery is deleted.
     */
    it("should delete a delivery by id", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: true};
        DeliveryMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
        Delivery.remove({_id: 12345},  (err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    
    /**
     * Test will be successful if fails to delete a delivery.
     */
    it("should return error if delete action is failed", (done) => {
        let DeliveryMock = sinon.mock(Delivery);
        let expectedResult = {status: false};
        DeliveryMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
        Delivery.remove({_id: 12345}, (err, result) => {
            DeliveryMock.verify();
            DeliveryMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});