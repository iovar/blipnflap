// TODO diferentiate to static config and environment

export const Config = (function() {
  var _config = function() {
    this.calibrate();
  };

  _config.prototype.CONST = {
    CANVAS_ID : 'screen',
    JUMP_SPEED : 1.3,
    GRAVITY: 4.0,
    BLOCKS_PER_SCREEN_HEIGHT: 20,
    BLOCKS_PER_PASS_HEIGHT: 5.0,
    BLOCKS_PER_PASS_WIDTH: 1.5,
    BLOCKS_PER_OBSTACLES: [3, 4, 5, 7, 8, 9],
    BLOCKS_PER_OBSTACE_DISTANCE: 3.6,
    BLOCKS_PER_GROUND: 4,
    BLOCKS_PER_SOAR_WIDTH: 1,
    BLOCKS_PER_OFFSET: {X: 2.5, Y: 8},
    COLLISION_BOUNDARY: 0.1,
    BG_PIXEL_SIZE: 4
  };

  _config.prototype.audio = {
    filename: 'audio/sounds.mp3',
    markers: {
      die: { start: 0, end: 0.3 },
      move: { start: 2, end: 2.3 },
      point: { start: 4, end: 4.3 },
    },
  };

  _config.prototype.calibrate = function() {
    this._canvasSize();
    this._blockSize();
    this._collisionBoundary();
    this._passSize();
    this._groundHeight();
    this._soarWidth();
    this._obstacleSize();
    this._obstacleDistance();
    this._maxObstaclesVisible();
    this._offset();
    this.colors('#000000','#013AE3','#FFFA23');
  };

  _config.prototype._canvasSize = function() {
    this.height = document.body.clientHeight;
    this.width = document.body.clientWidth;
  };

  _config.prototype._blockSize = function() {
    this.blockSize = this.height/this.CONST.BLOCKS_PER_SCREEN_HEIGHT | 0;
  };

  _config.prototype._collisionBoundary = function() {
    this.collisionBoundary =
      this.blockSize * this.CONST.COLLISION_BOUNDARY | 0;
  };

  _config.prototype._groundHeight = function() {
    this.groundHeight = this.height - this.blockSize * 12 - this.passHeight;
  };

  _config.prototype._passSize = function() {
    this.passHeight =
      this.blockSize * this.CONST.BLOCKS_PER_PASS_HEIGHT;
    this.passWidth =
      this.blockSize * this.CONST.BLOCKS_PER_PASS_WIDTH | 0;
  };

  _config.prototype._soarWidth = function() {
    this.soarWidth =
      this.blockSize * this.CONST.BLOCKS_PER_SOAR_WIDTH;
  };

  _config.prototype._obstacleSize = function() {
    var blockSize = this.blockSize;

    this.obstacleWidth = this.passWidth;
    this.obstacleHeight = this.CONST.BLOCKS_PER_OBSTACLES.map(
      function(blocks_per_obstacle) {
        return blocks_per_obstacle * blockSize;
      });
  };

  _config.prototype._obstacleDistance = function() {
    this.obstacleDistance =
      this.blockSize * this.CONST.BLOCKS_PER_OBSTACE_DISTANCE | 0;
  };

  _config.prototype._maxObstaclesVisible = function() {
    var repeatWidth = this.obstacleWidth + this.obstacleDistance;
    this.maxObstacles = Math.ceil(this.width / repeatWidth) + 1;
  };

  _config.prototype._offset = function() {
    this.offset = {
      x: this.blockSize * this.CONST.BLOCKS_PER_OFFSET.X | 0,
      y: this.blockSize * this.CONST.BLOCKS_PER_OFFSET.Y
    };
    var xalign = this.offset.x % this.CONST.BG_PIXEL_SIZE;
    if(xalign > this.CONST.BG_PIXEL_SIZE/2) {
      this.offset.x = this.offset.x - xalign +this.CONST.BG_PIXEL_SIZE;
    }
    else {
      this.offset.x = this.offset.x - xalign ;
    }
  };

  _config.prototype.colors = function(bg, fg, pl) {
    this.bg = bg || "#000000";
    this.fg = fg || "#ffffff";
    this.pl = pl || "#ffff22";
  };

  return _config;
})();
