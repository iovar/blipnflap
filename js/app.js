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
      if(e.which === 32 || e.keycode === 32) {
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
    FastClick.attach(document.body);
    //App is a singleton
    window.App = new _app();
  }, false);
})({});
