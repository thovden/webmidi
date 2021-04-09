const expect = require("chai").expect;
const midi = require("midi");
const sinon = require("sinon");
const {WebMidi} = require("../dist/webmidi.cjs.js");

// The virtual port is an "external" device so an input is seen as an output by WebMidi. To avoid
// confusion, the naming scheme adopts WebMidi's perspective.
let VIRTUAL_OUTPUT = new midi.Input();
let VIRTUAL_OUTPUT_NAME = "Virtual Output";
let WEBMIDI_OUTPUT;

describe("Output Object", function() {

  before(function () {
    VIRTUAL_OUTPUT.openVirtualPort(VIRTUAL_OUTPUT_NAME);
    VIRTUAL_OUTPUT.ignoreTypes(false, false, false); // enable sysex, timing & active sensing
  });

  after(function () {
    VIRTUAL_OUTPUT.closePort();
  });

  beforeEach("Check support and enable WebMidi.js", async function () {
    await WebMidi.enable();
    WEBMIDI_OUTPUT = WebMidi.getOutputByName(VIRTUAL_OUTPUT_NAME);
  });

  afterEach("Disable WebMidi.js", async function () {
    await WebMidi.disable();
  });

  describe("clear()", function () {

    it("should return 'Output' object for chaining", function() {
      expect(WEBMIDI_OUTPUT.clear()).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("close()", function () {

    it("should close connection", async function() {

      // Act
      await WEBMIDI_OUTPUT.close();

      // Assert
      expect(WEBMIDI_OUTPUT.connection).to.equal("closed");

    });

  });

  describe("decrementRegisteredParameter()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let rpn = "pitchbendrange";

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "decrementRegisteredParameter"));
      });

      // Act
      WEBMIDI_OUTPUT.decrementRegisteredParameter(
        rpn,
        valid.concat(invalid),
        options
      );

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(rpn, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let rpn = "pitchbendrange";

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "decrementRegisteredParameter"));
      });

      // Act
      WEBMIDI_OUTPUT.decrementRegisteredParameter(rpn, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(rpn, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the 'Output' object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.decrementRegisteredParameter("pitchbendrange")
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("destroy()", function () {

    it("should destroy the 'Output'", async function() {

      // Act
      await WEBMIDI_OUTPUT.destroy();

      // Assert
      try {
        WEBMIDI_OUTPUT.name;
      } catch (e) {
        await Promise.resolve();
      }

      if (WEBMIDI_OUTPUT.channels.length !== 0) return Promise.reject();
      if (WEBMIDI_OUTPUT.hasListener() === true) return Promise.reject();

    });

  });

  describe("incrementRegisteredParameter()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let rpn = "pitchbendrange";

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "incrementRegisteredParameter"));
      });

      // Act
      WEBMIDI_OUTPUT.incrementRegisteredParameter(
        rpn,
        valid.concat(invalid),
        options
      );

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(rpn, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let rpn = "pitchbendrange";

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "incrementRegisteredParameter"));
      });

      // Act
      WEBMIDI_OUTPUT.incrementRegisteredParameter(rpn, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(rpn, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the 'Output' object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.incrementRegisteredParameter("pitchbendrange")
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("open()", function () {

    it("should open connection", async function() {

      // Act
      await WEBMIDI_OUTPUT.close();
      await WEBMIDI_OUTPUT.open();

      // Assert
      expect(WEBMIDI_OUTPUT.connection).to.equal("open");

    });

  });

  describe("playNote()", function () {

    it("should trigger channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let note = 60;
      WEBMIDI_OUTPUT.channels.forEach(ch => spies.push(sinon.spy(ch, "playNote")));

      // Act
      WEBMIDI_OUTPUT.playNote(note, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;
      WEBMIDI_OUTPUT.channels.forEach(ch => spies.push(sinon.spy(ch, "playNote")));

      // Act
      WEBMIDI_OUTPUT.playNote(note, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.playNote(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });



    it("should send immediately if no valid timestamp is found", function (done) {

      // Arrange
      let note = 64;
      let sent = WebMidi.time;
      let timestamps = [-1, 0, -Infinity, undefined, null, WebMidi.time, NaN];
      let index = 0;

      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      timestamps.forEach(
        stamp => WEBMIDI_OUTPUT.channels[1].playNote(note, {channel: 1, time: stamp})
      );

      // Assert
      function assert(deltaTime, message) {

        if (JSON.stringify(message) == JSON.stringify([144, 64, 64])) {

          expect(WebMidi.time - sent).to.be.within(0, 5);
          index++;

          if (index === timestamps.length) {
            VIRTUAL_OUTPUT.removeAllListeners();
            done();
          }

        }

      }

    });

    // it("should schedule message according to absolute timestamp", function (done) {
    //
    //   // Arrange
    //   let status = 144;
    //   let data = [10, 0];
    //   let target = WebMidi.time + 100;
    //   VIRTUAL_OUTPUT.on("message", assert);
    //
    //   // Act
    //   WEBMIDI_OUTPUT.channels[1].send(status, data, {time: target});
    //
    //   // Assert
    //   function assert() {
    //     VIRTUAL_OUTPUT.removeAllListeners();
    //     expect(WebMidi.time - target).to.be.within(-5, 10);
    //     done();
    //   }
    //
    // });

    // it("should schedule message according to relative timestamp", function (done) {
    //
    //   // Arrange
    //   let status = 144;
    //   let data = [10, 0];
    //   let offset = "+100";
    //   let target = WebMidi.time + 100;
    //   VIRTUAL_OUTPUT.on("message", assert);
    //
    //   // Act
    //   WEBMIDI_OUTPUT.channels[1].send(status, data, {time: offset});
    //
    //   // Assert
    //   function assert() {
    //     VIRTUAL_OUTPUT.removeAllListeners();
    //     expect(WebMidi.time - target).to.be.within(-5, 10);
    //     done();
    //   }
    //
    // });



  });

  describe("resetAllControllers()", function () {

    it("should trigger channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "resetAllControllers"));
      });

      // Act
      WEBMIDI_OUTPUT.resetAllControllers(valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "resetAllControllers"));
      });

      // Act
      WEBMIDI_OUTPUT.resetAllControllers(options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.resetAllControllers()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("send()", function () {

    it("should throw error if status byte is invalid", function() {

      // Arrange
      let values = ["xxx", [], NaN, 127, 256, undefined, null, -1, 0, {}];

      // Act
      values.forEach(assert);

      // Assert
      function assert(param){
        expect(() => {
          WEBMIDI_OUTPUT.send(param);
        }).to.throw(RangeError);
      };

    });

    it("should throw error if data bytes are invalid", function() {

      // Arrange
      let values = [
        "xxx",
        -1,
        256,
        NaN,
        null,
        Infinity,
        [],
        [0, -1],
        [0, 256],
        [-1, 0],
        [256, 0]
      ];

      // Act
      values.forEach(assert);

      // Assert
      function assert(param){
        expect(() => {
          WEBMIDI_OUTPUT.send(128, param);
        }).to.throw();
      };

    });

    it("should throw error if message is incomplete", function() {

      // Arrange
      let values = [0x80, 0x90, 0xA0];

      // Act
      values.forEach(assert);

      // Assert
      function assert(param) {
        expect(() => {
          WEBMIDI_OUTPUT.send(param, []);
        }).to.throw(TypeError);
      }

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.send(144, [64, 64])
      ).to.equal(WEBMIDI_OUTPUT);
    });

    it("should actually send the message", function(done) {

      // Arrange
      let expected = [0x90, 60, 127]; // Note on: channel 0 (144), note number (60), velocity (127)
      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      WEBMIDI_OUTPUT.send(expected[0], [expected[1], expected[2]]);

      // Assert
      function assert(deltaTime, message) {
        expect(message).to.have.ordered.members(expected);
        VIRTUAL_OUTPUT.removeAllListeners();
        done();
      }

    });

    it("should send immediately if no valid timestamp is found", function (done) {

      // Arrange
      let status = 144;
      let parameters = [13, 0];
      let sent = WebMidi.time;
      let timestamps = [-1, 0, -Infinity, undefined, null, WebMidi.time, NaN];
      let index = 0;

      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      timestamps.forEach(
        stamp => WEBMIDI_OUTPUT.channels[1].send(status, parameters, {time: stamp})
      );

      // Assert
      function assert(deltaTime, message) {

        if (JSON.stringify(message) == JSON.stringify([].concat(status, parameters))) {

          expect(WebMidi.time - sent).to.be.within(0, 5);
          index++;

          if (index === timestamps.length) {
            VIRTUAL_OUTPUT.removeAllListeners();
            done();
          }

        }

      }

    });

    it("should schedule message according to absolute timestamp", function (done) {

      // Arrange
      let status = 144;
      let data = [10, 0];
      let target = WebMidi.time + 100;
      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      WEBMIDI_OUTPUT.channels[1].send(status, data, {time: target});

      // Assert
      function assert() {
        VIRTUAL_OUTPUT.removeAllListeners();
        expect(WebMidi.time - target).to.be.within(-5, 10);
        done();
      }

    });

    it("should schedule message according to relative timestamp", function (done) {

      // Arrange
      let status = 144;
      let data = [10, 0];
      let offset = "+100";
      let target = WebMidi.time + 100;
      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      WEBMIDI_OUTPUT.channels[1].send(status, data, {time: offset});

      // Assert
      function assert() {
        VIRTUAL_OUTPUT.removeAllListeners();
        expect(WebMidi.time - target).to.be.within(-5, 10);
        done();
      }

    });

  });

  describe("sendActiveSensing()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 254) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (254)
      WEBMIDI_OUTPUT.sendActiveSensing();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendActiveSensing(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendChannelAftertouch() [legacy]", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setChannelAftertouch"));
      });

      WEBMIDI_OUTPUT.sendChannelAftertouch(value, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendChannelAftertouch(0.5)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendChannelMode()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendChannelMode"));
      });

      WEBMIDI_OUTPUT.sendChannelMode("allnotesoff", 42, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly("allnotesoff", 42, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 42;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendChannelMode"));
      });

      // Act
      WEBMIDI_OUTPUT.sendChannelMode("allnotesoff", value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly("allnotesoff", value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendChannelMode("allnotesoff", 42, [1])
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendClock()", function () {

    it("should actually send the message", function(done) {

      // Arrange
      VIRTUAL_OUTPUT.on("message", assert);

      // Act
      WEBMIDI_OUTPUT.sendClock();

      // Assert
      function assert(deltaTime, message) {
        if (message[0] === 248) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      }

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendClock()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendContinue()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 251) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (251)
      WEBMIDI_OUTPUT.sendContinue();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendContinue()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendControlChange()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendControlChange"));
      });

      WEBMIDI_OUTPUT.sendControlChange(60, 64, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, 64, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;
      let value = 64;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendControlChange"));
      });

      // Act
      WEBMIDI_OUTPUT.sendControlChange(note, value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendControlChange(60, 64, [1])
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendKeyAftertouch() [legacy]", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let pressure = 0.75;
      let note = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setKeyAftertouch"));
      });

      WEBMIDI_OUTPUT.sendKeyAftertouch(note, valid.concat(invalid), pressure, options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, pressure, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendKeyAftertouch(60, 0.75)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendNoteOff()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendNoteOff"));
      });

      WEBMIDI_OUTPUT.sendNoteOff(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendNoteOff"));
      });

      // Act
      WEBMIDI_OUTPUT.sendNoteOff(note, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendNoteOff(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendNoteOn()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendNoteOn"));
      });

      WEBMIDI_OUTPUT.sendNoteOn(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "sendNoteOn"));
      });

      // Act
      WEBMIDI_OUTPUT.sendNoteOn(note, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(note, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendNoteOn(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendPitchBend() [legacy]", function () {

    it("should trigger the channel method for all valid channels", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let bend = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPitchBend"));
      });

      // Act
      WEBMIDI_OUTPUT.sendPitchBend(bend, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(bend, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {

      // Arrange
      let bend = 0.5;
      let channel = 1;

      // Assert
      expect(
        WEBMIDI_OUTPUT.sendPitchBend(bend, channel)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendProgramChange() [legacy]", function () {

    it("should trigger the channel method for all valid channels", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setProgram"));
      });

      WEBMIDI_OUTPUT.sendProgramChange(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendProgramChange(64, [1])
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendReset()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 255) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (255)
      WEBMIDI_OUTPUT.sendReset();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendReset(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendSongPosition() [legacy]", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 242) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (242)
      WEBMIDI_OUTPUT.sendSongPosition();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendSongPosition(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendSongSelect() [legacy]", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 243) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (243)
      WEBMIDI_OUTPUT.sendSongSelect(42);

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendSongSelect(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendStart()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 250) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (250)
      WEBMIDI_OUTPUT.sendStart();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendStart(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendStop()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 252) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (252)
      WEBMIDI_OUTPUT.sendStop();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendStop(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendSysex()", function () {

    it("should throw error if 'sysex' was not enabled", function() {
      expect(() => {
        WEBMIDI_OUTPUT.sendSysex(66, [1, 2, 3, 4, 5]);
      }).to.throw();
    });

    it("should actually send the message", async function() {

      await WebMidi.disable();
      await WebMidi.enable({sysex: true});
      WEBMIDI_OUTPUT = WebMidi.getOutputByName(VIRTUAL_OUTPUT_NAME);

      await new Promise(resolve => {

        VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {

          if (
            message[0] === 240 &&
            message[1] === 0x42 &&
            message[2] === 0x1 &&
            message[3] === 0x2 &&
            message[4] === 0x3 &&
            message[5] === 247
          ) {
            VIRTUAL_OUTPUT.removeAllListeners();
            resolve();
          }

        });

        // Sysex (240...247)
        WEBMIDI_OUTPUT.sendSysex(0x42, [0x1, 0x2, 0x3]);

      });


    });

    it("should return the Output object for method chaining", async function() {
      await WebMidi.disable();
      await WebMidi.enable({sysex: true});
      WEBMIDI_OUTPUT = WebMidi.getOutputByName(VIRTUAL_OUTPUT_NAME);
      expect(
        WEBMIDI_OUTPUT.sendSysex(66, [1, 2, 3, 4, 5])
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendTimecodeQuarterFrame()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 241 && message[1] === 42) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (251)
      WEBMIDI_OUTPUT.sendTimecodeQuarterFrame(42);

    });

    it("should throw error on invalid data", function() {

      [255, 9999999, undefined, null, [], {}].forEach(value => {
        expect(() => {
          WEBMIDI_OUTPUT.sendTimecodeQuarterFrame(value);
        }).to.throw();
      });


    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendTimecodeQuarterFrame(0)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendTuneRequest()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 246) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (246)
      WEBMIDI_OUTPUT.sendTuneRequest();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendTuneRequest()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("sendTuningRequest() [legacy]", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 246) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (246)
      WEBMIDI_OUTPUT.sendTuningRequest();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendTuningRequest()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setChannelAftertouch()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setChannelAftertouch"));
      });

      // Act
      WEBMIDI_OUTPUT.setChannelAftertouch(value, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setChannelAftertouch"));
      });

      // Act
      WEBMIDI_OUTPUT.setChannelAftertouch(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {

      // Arrange
      let value = 0.5;

      // Assert
      expect(
        WEBMIDI_OUTPUT.setChannelAftertouch(value)
      ).to.equal(WEBMIDI_OUTPUT);

    });

  });

  describe("setKeyAftertouch()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setKeyAftertouch"));
      });

      // Act
      WEBMIDI_OUTPUT.setKeyAftertouch(note, value, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWith(note, value)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let note = 60;
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setKeyAftertouch"));
      });

      // Act
      WEBMIDI_OUTPUT.setKeyAftertouch(note, value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWith(note, value)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {

      // Arrange
      let note = 60;
      let value = 0.5;

      // Assert
      expect(
        WEBMIDI_OUTPUT.setKeyAftertouch(note, value)
      ).to.equal(WEBMIDI_OUTPUT);

    });

  });

  describe("setLocalControl()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setLocalControl"));
      });

      WEBMIDI_OUTPUT.setLocalControl(true, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(true, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setLocalControl"));
      });

      // Act
      WEBMIDI_OUTPUT.setLocalControl(true, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(true, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setLocalControl(true)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setMasterTuning()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setMasterTuning"));
      });

      WEBMIDI_OUTPUT.setMasterTuning(42, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(42, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 42;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setMasterTuning"));
      });

      // Act
      WEBMIDI_OUTPUT.setMasterTuning(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setMasterTuning(true)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setModulationRange()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setModulationRange"));
      });

      // Act
      WEBMIDI_OUTPUT.setModulationRange(42, 24, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(42, 24, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let semitones = 42;
      let cents = 24;


      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setModulationRange"));
      });

      // Act
      WEBMIDI_OUTPUT.setModulationRange(semitones, cents, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(semitones, cents, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setModulationRange(5)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setNonRegisteredParameter()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setNonRegisteredParameter"));
      });

      WEBMIDI_OUTPUT.setNonRegisteredParameter([2, 63], [0, 10], valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly([2, 63], [0, 10], options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let parameter = [2, 63];
      let data = [0, 10];


      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setNonRegisteredParameter"));
      });

      // Act
      WEBMIDI_OUTPUT.setNonRegisteredParameter(parameter, data, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(parameter, data, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setNonRegisteredParameter([2, 63], [0, 10], 1)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setOmniMode()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setOmniMode"));
      });

      WEBMIDI_OUTPUT.setOmniMode(true, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(true, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = true;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setOmniMode"));
      });

      // Act
      WEBMIDI_OUTPUT.setOmniMode(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setOmniMode(true)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setProgram()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setProgram"));
      });

      WEBMIDI_OUTPUT.setProgram(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setProgram"));
      });

      // Act
      WEBMIDI_OUTPUT.setProgram(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendProgramChange(64, [1])
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setPitchBend()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPitchBend"));
      });

      // Act
      WEBMIDI_OUTPUT.setPitchBend(0.5, valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(0.5, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 0.5;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPitchBend"));
      });

      // Act
      WEBMIDI_OUTPUT.setPitchBend(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {

      // Arrange
      let value = -0.5;

      // Assert
      expect(
        WEBMIDI_OUTPUT.setPitchBend(value)
      ).to.equal(WEBMIDI_OUTPUT);

    });

  });

  describe("setPitchBendRange()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPitchBendRange"));
      });

      WEBMIDI_OUTPUT.setPitchBendRange(42, 24, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(42, 24, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let semitones = 42;
      let cents = 24;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPitchBendRange"));
      });

      // Act
      WEBMIDI_OUTPUT.setPitchBendRange(semitones, cents, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(semitones, cents, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setPitchBendRange(42, 24)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setPolyphonicMode()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPolyphonicMode"));
      });

      WEBMIDI_OUTPUT.setPolyphonicMode("mono", valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly("mono", options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = "mono";

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setPolyphonicMode"));
      });

      // Act
      WEBMIDI_OUTPUT.setPolyphonicMode(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setPolyphonicMode("mono")
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setProgram()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setProgram"));
      });

      WEBMIDI_OUTPUT.setProgram(42, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(42, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 42;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setProgram"));
      });

      WEBMIDI_OUTPUT.setProgram(value, options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setProgram(42)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setRegisteredParameter()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setRegisteredParameter"));
      });

      WEBMIDI_OUTPUT.setRegisteredParameter("modulationrange", 42, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly("modulationrange", 42, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let parameter = "modulationrange";
      let value = 42;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setRegisteredParameter"));
      });

      WEBMIDI_OUTPUT.setRegisteredParameter(parameter, value, options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(parameter, value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setRegisteredParameter("modulationrange", 42)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setSong()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 243) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (243)
      WEBMIDI_OUTPUT.setSong(42);

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setSong(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setSongPosition()", function () {

    it("should actually send the message", function(done) {

      VIRTUAL_OUTPUT.on("message", (deltaTime, message) => {
        if (message[0] === 242) {
          VIRTUAL_OUTPUT.removeAllListeners();
          done();
        }
      });

      // Note on (242)
      WEBMIDI_OUTPUT.setSongPosition();

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.sendActiveSensing(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setTuningBank()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setTuningBank"));
      });

      WEBMIDI_OUTPUT.setTuningBank(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let bank = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setTuningBank"));
      });

      // Act
      WEBMIDI_OUTPUT.setTuningBank(bank, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(bank, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setTuningBank(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("setTuningProgram()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setTuningProgram"));
      });

      WEBMIDI_OUTPUT.setTuningProgram(60, valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(60, options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};
      let value = 60;

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "setTuningProgram"));
      });

      // Act
      WEBMIDI_OUTPUT.setTuningProgram(value, options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(value, options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.setTuningProgram(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("stopNote()", function () {

    it("should call 'sendNoteOff()' method", function() {

      // Arrange
      let note = 60;
      let options = {time: 0};
      let spy = sinon.spy(WEBMIDI_OUTPUT, "sendNoteOff");

      // Act
      WEBMIDI_OUTPUT.stopNote(note, options);

      // Assert
      expect(spy.calledOnceWithExactly(note, options)).to.be.true;

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.stopNote(64)
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("turnNotesOff()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "turnNotesOff"));
      });

      WEBMIDI_OUTPUT.turnNotesOff(valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "turnNotesOff"));
      });

      // Act
      WEBMIDI_OUTPUT.turnNotesOff(options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.turnNotesOff()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

  describe("turnSoundOff()", function () {

    it("should trigger the channel method for all valid channels [legacy]", function() {

      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "turnSoundOff"));
      });

      WEBMIDI_OUTPUT.turnSoundOff(valid.concat(invalid), options);

      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should trigger the channel method for all valid channels [normal]", function() {

      // Arrange
      let spies = [];
      let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      let invalid = [undefined, null, NaN, -1, "", Infinity, -Infinity];
      let options = {time: 123, channels: valid.concat(invalid)};

      WEBMIDI_OUTPUT.channels.forEach(ch => {
        spies.push(sinon.spy(ch, "turnSoundOff"));
      });

      // Act
      WEBMIDI_OUTPUT.turnSoundOff(valid.concat(invalid), options);

      // Assert
      spies.forEach(spy => {
        expect(spy.calledOnceWithExactly(options)).to.be.true;
        spy.restore();
      });

    });

    it("should return the Output object for method chaining", function() {
      expect(
        WEBMIDI_OUTPUT.turnSoundOff()
      ).to.equal(WEBMIDI_OUTPUT);
    });

  });

});
