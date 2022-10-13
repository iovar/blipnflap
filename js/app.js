import { Config } from './config.js';
import { audio } from './audio.js';
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
    this.game = new Game(this.screen, this.config);
    this._setupEventListeners();
    this.screen.clear();
    this.soundsLoaded = false;
    audio.play('die');
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
      if(!this.soundsLoaded) {
        audio.load();
        this.soundsLoaded = true;
      }
      self._handleEvent();
    });
  };

  _app.prototype._handleEvent = function() {
    if(this.game.state === 0) {
      this.game.start();
      audio.play('move');
    }
    else if(this.game.state === 1){
      this.game.jump();
      audio.play('move');
    }
  };

  window.addEventListener('load', function() {
    window.App = new _app();
  }, false);
})({});
