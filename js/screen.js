var Screen = (function() {
  var exports = function() {
    this.canvas = document.getElementById('screen');
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.context = this.canvas.getContext('2d');
    this.fg = "#ffffff";
    this.bg = "#000000";
    this.y = this.canvas.height * 0.45;
    this.x = this.canvas.width/10;
  };

  exports.prototype.clear = function() {
    this.context.fillStyle = this.bg;
    this.context.fillRect(0,0,
        this.canvas.width,this.canvas.height);
  };

  exports.prototype.drawPlayer = function(position) {
    this.context.fillStyle = this.fg;
    this.context.fillRect(position.x+this.x,
        position.y+this.y,
        this.canvas.height/20, this.canvas.height/20);
  };

  exports.prototype.drawObstacles = function(level) {

  };

  exports.prototype.draw = function(position, level) {

  };


  return exports;
})();
