import { Audio } from './audio.js';
import { Config } from './config.js';
import { Screen } from './screen.js';
import { Game } from './game.js';

var keys = [
    13, // enter
    32, // space
    38, // arrow up
];

(function() {
  var _app = function() {
    this.config = new Config();
    this.screen = new Screen(this.config);
    this.audio = new Audio(this.config.audio.filename, this.config.audio.markers);
    this.game = new Game(this.screen, this.audio, this.config);
    this._setupEventListeners();
    this.screen.clear();
    this.soundsLoaded = false;
    this.audio.play('die');
  };

  _app.prototype._setupEventListeners = function() {
    var self = this,
        resizeTimer = -1;
    addEventListener('keydown', function(e) {
      var v = e.which || e.keycode;
      if(v && keys.includes(v)) {
        self._handleEvent();
      }
    });

    addEventListener('touchstart', function(e) {
      if(!self.soundsLoaded) {
        self.audio.load();
        self.soundsLoaded = true;
      }
      self._handleEvent();
    });
  };

  _app.prototype._handleEvent = function() {
    if(this.game.state === 0) {
      this.game.start();
      this.audio.play('move');
    }
    else if(this.game.state === 1){
      this.game.jump();
      this.audio.play('move');
    }
  };

  window.addEventListener('load', function() {
    window.App = new _app();
  }, false);
})({});
