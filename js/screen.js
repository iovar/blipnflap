var Screen = (function() {
  var _screen = function(config) {
    this.config = config;
    this._init();
    this._adjustSize();
  };

  _screen.prototype._adjustSize = function() {
    this.canvas.height = this.config.height;
    this.canvas.width = this.config.width;
  };

  _screen.prototype._init = function() {
    this.canvas = document.getElementById(this.config.CONST.CANVAS_ID);
    this.context = this.canvas.getContext('2d');
    this.offset = 0;
    this._moving = true;
  };

  _screen.prototype.clear = function() {
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(0,0,
        this.config.width,this.config.height);
  };

  _screen.prototype.drawPlayer = function(position) {
    this.context.fillStyle = this.config.fg;
    this.context.fillRect(position.x+this.config.offset.x,
        position.y+this.config.offset.y,
        this.config.blockSize, this.config.blockSize);
  };

  _screen.prototype.drawObstacles = function(level) {
    var offset = 0;

    this.config.fillStyle = this.config.fg;
    for(var i=0;i<level.length;i++) {
      this.context.fillRect(offset + level[i].left,
                    0,
                    this.config.obstacleWidth,
                    level[i].top);

      this.context.fillRect(offset + level[i].left,
                    level[i].top + level[i].pass,
                    this.config.obstacleWidth,
                    level[i].bottom);
      offset += level[i].left + this.config.obstacleWidth;
    }
  };

  _screen.prototype.drawGround = function(left) {
    var y = this.config.height - this.config.groundHeight -
            this.config.blockSize/4,
        height = this.config.groundHeight + this.config.blockSize/4,
        width = this.config.width,
        repeat = (this.config.obstacleWidth +
                 this.config.obstacleDistance),
        numlines = 5,
        line = repeat/(numlines*2),
        offset = this.offset;

    this.context.fillRect(0,y, width, height/10);
    for(var i =0; i<this.config.maxObstacles*numlines; i++) {
      this.context.fillRect(offset, y, line, height);
      offset += 2*line;
    }
    if(this.offset<-line) {
      this.offset = line;
    }
    if(this._moving) {
      this.offset-= this.config.blockSize/8;
    }
  };

  _screen.prototype.draw = function(position, level) {
    this.clear();
    this.drawPlayer(position);
    this.drawObstacles(level);
    this.drawGround();
  };

  _screen.prototype.pauseGround = function() {
    this._moving = false;
  };

  _screen.prototype.resumeGround = function() {
    this._moving = true;
  };

  return _screen;
})();
