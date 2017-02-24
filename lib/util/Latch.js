function Latch(n, cb){
  this.count = n; 
  this.cb = cb;
}

Latch.prototype.down = function(){
  if(--this.count == 0) this.cb();
};

module.exports = Latch;
