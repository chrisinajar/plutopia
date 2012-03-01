var assert = require('assert');

var Painter = function(gl) {
  this.gl = gl;
  this.lastType = null;
  this.r = 1.0;
  this.g = 1.0;
  this.b = 1.0;
  this.x = 0;
  this.y = 0;
  this.xoffset = -0;
  this.yoffset = -0;
  this.zoom = 0.0;
  this.texture = null;
  this.isInit = false;
};
Painter.plock = null;

Painter.prototype.init = function() {
  if (this.isInit) return;
  assert.equal(Painter.plock, null, 'Only one painter may be open at a time.');
  Painter.plock = this;
  var gl = this.gl;

  gl.glClear(gl.GL_COLOR_BUFFER_BIT);
  gl.glLoadIdentity();
  //gl.glTranslatef(0, 0, 0);
  gl.glTranslatef(0.375, 0.375, 0);
  //gl.glTranslatef(this.x+this.xoffset,this.y+this.yoffset,this.zoom);
  
  this.isInit = true;
};

Painter.prototype.setColor = function(r,g,b) {
  this.r = r;
  this.g = g;
  this.b = b;
  if (this.lastType != null) {
    gl.glColor3f(this.r,this.g,this.b);
  }
};

Painter.prototype.setTexture = function(tex, pos) {
  if (!pos) {
    pos = [
      [ 0, 1 ],
      [ 1, 1 ],
      [ 1, 0 ],
      [ 0, 0 ],
    ];
  }
  this.texture = {
    pos: pos,
    tex: tex,
  };
  if (this.lastType != null) {
    gl.glBindTexture(gl.GL_TEXTURE_2D, tex.getTexture());
  }
};

Painter.prototype.removeTexture = function() {
  this.texture = null;
  gl.glLoadIdentity();
  gl.glTranslatef(this.x+this.xoffset,this.y+this.yoffset,this.zoom);
}

Painter.prototype.move = function(x, y) {
  if (this.x == x && this.y == y) return;
  var gl = this.gl;
  this.x = x;
  this.y = y;
  gl.glLoadIdentity();
  gl.glTranslatef(this.x+this.xoffset,this.y+this.yoffset,this.zoom);
}

Painter.prototype.groupRender = function(t,f,d) {
  this.init();
  var gl = this.gl;
  if (this.lastType != t) {
    if (this.lastType != null) {
      gl.glEnd();
      gl.glLoadIdentity();
    }
    this.lastType = t;
    gl.glBegin(t);
  }
  if (this.texture != null)
    gl.glBindTexture(gl.GL_TEXTURE_2D, this.texture.tex.getTexture());
  //else
    gl.glColor3f(this.r,this.g,this.b);
  
  f(d);
}

Painter.prototype.drawRect = function(x1,y1,x2,y2) {
  this.init();
  var gl = this.gl;
  this.groupRender(gl.GL_QUADS, function(s) {
    var gl = s.gl;
    if (s.texture != null)
      gl.glTexCoord2f(s.texture.pos[0][0], s.texture.pos[0][1]);
    gl.glVertex2f(x1, y1, 0.0);
    if (s.texture != null)
      gl.glTexCoord2f(s.texture.pos[1][0], s.texture.pos[1][1]);
    gl.glVertex2f(x2, y1, 0.0);
    if (s.texture != null)
      gl.glTexCoord2f(s.texture.pos[2][0], s.texture.pos[2][1]);
    gl.glVertex2f(x2, y2, 0.0);
    if (s.texture != null)
      gl.glTexCoord2f(s.texture.pos[3][0], s.texture.pos[3][1]);
    gl.glVertex2f(x1, y2, 0.0);
  }, this);
};

Painter.prototype.drawTriangle = function(x1,y1,x2,y2,x3,y3) {
  this.init();
  var gl = this.gl;
  this.move(x,y);
  this.groupRender(gl.GL_TRIANGLES, function(gl) {
    gl.glVertex2f(x1, y1, 0.0);
    gl.glVertex2f(x2, y2, 0.0);
    gl.glVertex2f(x3, y3, 0.0);
  }, gl);
};

Painter.prototype.draw = function() {
  this.init();
  var gl = this.gl;
  if (this.lastType != null) {
    gl.glEnd();
    this.lastType = null;
  }
  gl.SwapBuffers();
  Painter.plock = null;
  this.isInit = false;
};

module.exports = Painter;