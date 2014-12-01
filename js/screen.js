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

  _screen.prototype.drawPlayer = function(position,speed) {
    this.context.fillStyle = this.config.fg;
    this.context.save();
    this.context.translate(
        (position.x+this.config.offset.x+this.config.blockSize/2),
        (position.y+this.config.offset.y+this.config.blockSize/2));
    this.context.rotate(-speed/3);
    this.context.translate(
        -(position.x+this.config.offset.x+this.config.blockSize/2),
        -(position.y+this.config.offset.y+this.config.blockSize/2));
    this.context.fillRect(position.x+this.config.offset.x,
        position.y+this.config.offset.y,
        this.config.blockSize, this.config.blockSize);
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.6,
        position.y+this.config.offset.y+this.config.blockSize*0.2,
        this.config.blockSize*0.2, this.config.blockSize*0.2);
    this.context.fillStyle = this.config.fg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.65,
        position.y+this.config.offset.y+this.config.blockSize*0.25,
        this.config.blockSize*0.1, this.config.blockSize*0.1);
    this.context.fillStyle = this.config.bg;
    this.context.fillRect(position.x+this.config.offset.x+this.config.blockSize*0.3,
        position.y+this.config.offset.y+this.config.blockSize*0.8,
        this.config.blockSize*0.7, this.config.blockSize*0.1);
    this.context.restore();
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

    this.context.fillStyle = this.config.fg;
    this.context.fillRect(0,y+height*0.05, width, height*0.95);
    for(var i =0; i<this.config.maxObstacles*numlines; i++) {
      this.context.fillRect(offset, y, line, height*0.05);
      offset += 2*line;
    }
    if(this.offset<-line) {
      this.offset = line;
    }
    if(this._moving) {
      this.offset-= this.config.blockSize/8;
    }
  };

  _screen.prototype.draw = function(position, speed, level) {
    this.clear();
    this.drawGround();
    this.drawObstacles(level);
    this.drawPlayer(position,speed);
  };

  _screen.prototype.pauseGround = function() {
    this._moving = false;
  };

  _screen.prototype.resumeGround = function() {
    this._moving = true;
  };

  return _screen;
})();
