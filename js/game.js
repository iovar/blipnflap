var Game = (function() {
  var exports = function(screen) {
    var self = this;

    this.screen = screen;
    this.reset();
    this.timer = setInterval( function() {
      self.loop();
    },33);
  };

  exports.prototype.reset = function() {
    this.state = 0; //0 not started, 1 playing, 2 dead
    this.ymod = 0;
    this.position = {x:0,y:0};
    this.speed = 0;
    this.timestamp = Date.now();
    this.level = [];
  };

  exports.prototype.advance = function() {

  };

  exports.prototype.check = function() {
    return (this._checkBottom());
  };

  exports.prototype._checkBottom = function() {
    if(this.position.y>this.screen.canvas.height/2) {
      this.position.y = this.screen.canvas.height/2
      return true;
    }
  };

  exports.prototype.loop = function() {
    this.screen.clear();
    this.screen.drawPlayer(this.position);
    if(this.state === 1) {
      this.move();
      this.advance();
      if(this.check()) {
        var self = this;

        this.state = 2;
        setTimeout(function() {
          self.reset();
        },3000);
      }
    }
    else if(this.state === 0) {
      this.soar();
    }
  };

  exports.prototype.start = function() {
    this.reset();
    this.state = 1;
    this.speed = 2;
  };

  exports.prototype.move = function() {
    var dt = (Date.now() - this.timestamp)/1000;
    this.position.y-=this.speed*(this.screen.canvas.height/100);
    this.speed -= 1/2 * (7.63 * Math.pow(dt,2));
  };

  exports.prototype.soar = function() {
    var pos = Math.sin(this.ymod/10)*(this.screen.canvas.height/40);
    this.position.y = pos;
    this.ymod++;
  };

  exports.prototype.jump = function() {
    this.speed = 2;
    this.timestamp = Date.now();
  };


  exports.prototype.end = function() {

  };

  return exports;
})();
