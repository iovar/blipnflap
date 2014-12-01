//App is a singleton
var App = (function() {
  var _app = function() {
    this.config = new Config();
    this.screen = new Screen(this.config);
    this.game = new Game(this.screen, this.config);
    this._setupEventListeners();
    this.screen.clear();
  };

  _app.prototype._setupEventListeners = function() {
    var self = this,
        resizeTimer = -1;
    addEventListener('keydown', function(e) {
      if(e.which === 32 || e.keycode === 32) {
        self._handleEvent();
      }
    });
    addEventListener('touchstart', function(e) {
      self._handleEvent();
    });
    addEventListener('resize', function(e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        console.log('res');
        self.config.calibrate();
        self.screen._adjustSize();
        self.game._generateLevel();
      },500);
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

  return new _app();
})({});
