/* jshint node : true */
/* jshint mocha : true */

var assert = require('assert');
var net = require('net');
var fs = require('fs');

console.log('Running test');

describe('Testing that Dependencies Load', function () {
    it('Loaded Objectifier', function () {
        var target = require('../objectifier.js');
    });
    it('Loaded Packet Decoder', function () {
        var target = require('../parsepackets.js');
    });
    it('Loaded Recieve Client to Server Message Marker', function () {
        var target = require('../recieveCTOS.js');
    });
    it('Loaded Recieve Server to Client Message Marker', function () {
        var target = require('../recieveSTOC.js');
    });
    it('Loaded Development/Stage/Production Markers', function () {
        var target = require('../servercontrol.json');
        assert((target.production === 'http://salvationdevelopment.com/launcher/'), true);
    });
    it('Loaded Update System', function () {
        var target = require('../server/update.js');
    });
});

describe('TOS & Licences are Included', function () {
    it('Terms of Service', function () {
        assert((fs.existsSync('../server/licence/sdlauncher-tos.text') !== null), true);
    });
    it('YGOPro', function () {
        assert((fs.existsSync('../server/licence/ygopro.txt') !== null), true);
    });
    it('Node-Webkit', function () {
        assert((fs.existsSync('../server/licence/node-webkit.text') !== null), true);
    });
    it('Machinima Sound', function () {
        assert((fs.existsSync('../server/licence/machinimasound.text') !== null), true);
    });
    it('Fake Detection', function () {
        assert((fs.existsSync('../server/licence/sdlauncher-tos.text') !== null), false);
    });

});
describe('Structures Test', function () {
    var structureDefinition = require('../objectifier.js');
    it('Structure Creation', function () {
        var strut = null;
        strut = structureDefinition({
            test: 'int',
            long: "long"
        });
        assert((strut !== null), true);
    });
    it('Structure Read and write', function () {
        var strut = structureDefinition({
            test: 'int',
            long: "long"
        });
        var out = strut.write({
            test: 1,
            long: 34
        });
        var validate = strut.read(out);
        console.log(out);
        assert((validate === {
            test: 1,
            long: 34
        }), true);
        console.log(validate);
    });

});
describe('Test Network Connection Methods', function () {
    var target = require('../manager.js');

    it('TCP Native', function () {
        var socket = net.createConnection(8911);
        socket.on('connect', function (connect) {
            var playerconnect1 = require('./playerconnect1.js');
            var message = new Buffer(playerconnect1);
            socket.write(message);
            socket.end();
        });
    });
    it('Primus Websocket Connects, Starts Receieving Gamelist, and Request Duel', function () {
        var http = require('net');
        var server = http.createServer().listen(5003);
        var Primus = require('primus');
        var primus = new Primus(server);
        var Socket = primus.Socket;

        var client = new Socket('http://localhost:5000');
        var playerconnect1 = require('./playerconnect1.js');
        var message = new Buffer(playerconnect1);
        client.write({
            action: 'join'
        });
        client.write({
            action: 'core',
            transmission: message
        });
    });
});