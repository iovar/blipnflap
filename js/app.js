//App is a singleton
var App = (function(exports) {
  var _app = function() {
    this.screen = new Screen();
    this.game = new Game(this.screen);
    this._setupEventListeners();
    this.screen.clear();
  };

  _app.prototype._setupEventListeners = function() {
    var self = this;
    addEventListener('keydown', function(e) {
      if(e.which === 32 || e.keycode === 32) {
        self._handleEvent();
      }
    });
    addEventListener('touchstart', function(e) {
      self._handleEvent();
    });
  };

  _app.prototype._handleEvent = function() {
    if(this.game.state === 0) {
      this.game.start();
    }
    else if(this.game.state === 1){
      this.game.jump();
    }
  };

  exports.app = new _app();

  return exports;
})({});
