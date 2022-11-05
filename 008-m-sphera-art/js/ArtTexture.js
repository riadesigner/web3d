
var VoronoiImage = {
  init:function(canvas,colors,opt) {
    this.voronoi = new Voronoi();
    this.opt = opt; 
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');    
    this.ARR_COLORS = colors;
    this.bbox = {xl: 0,xr: this.canvas.offsetWidth,yt: 0,yb: this.canvas.offsetHeight};   
    this.random_sites();
    this.behavior();
    this.render();
  },
  random_sites:function(){    
    this.sites = this.createSites();
    this.diagram && this.voronoi.recycle(this.diagram);
    this.diagram = this.voronoi.compute(this.sites, this.bbox);
    this.render();
  },
  behavior:function() {
    document.addEventListener('mouseup',(event)=>{this.random_sites();});
  },
  createSites:function() {
    var grid = this.opt.sites_grid;
    var amount = this.ARR_COLORS.length;
    var noise = this.opt.sites_noise;

    var arr = []; 
    var stepX = this.canvas.offsetWidth/grid;
    var stepY = this.canvas.offsetHeight/grid;
    for(var i=stepX;i<stepX*grid;i+=stepX){
      for(var j=stepY;j<stepY*grid;j+=stepY){
        if(noise){
          var noise_dir = Math.random() < 0.5 ? 1:-1;
          i += (Math.random()*noise*noise_dir);
          j += (Math.random()*noise*noise_dir);
        }
        arr.push({x:i,y:j});
      }
    };
    arr.sort(() => .5 - Math.random());   
    var total = Math.min(amount,arr.length);
    return arr.splice(0,total);
  },  
  drawPoints:function(arr,color,size){        
        var color = color?color:"black";
        this.ctx.save();
        this.ctx.fillStyle = color;
    for(var i in arr){                
      this.ctx.fillRect(arr[i].x-size/2,arr[i].y-size/2,size,size);
    }
    this.ctx.resore();
  },
  get_color_random:function() {
    var color = [
      "rgba(",
      Math.random()*155+100+",",
      Math.random()*155+100+",",
      Math.random()*155+100+",",
      1,
      ")"
    ].join(""); 
    return color;
  },
    render: function() {            
        
        // --- BG ---
        
        this.ctx.globalAlpha = 1;
        this.ctx.beginPath();
        this.ctx.rect(0,0,this.canvas.offsetWidth,this.canvas.offsetHeight);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();                
        if (!this.diagram) {return;}
        if (!this.sites.length) {return;}

    // --- CELLS ---

        for (var i in this.sites){

          var cell = this.diagram.cells[this.sites[i].voronoiId];
      // there is no guarantee a Voronoi cell will exist for any
      // particular site

      if (cell) {
        var halfedges = cell.halfedges,
          nHalfedges = halfedges.length;
        if (nHalfedges > 2) {
          var v = halfedges[0].getStartpoint();
          this.ctx.beginPath();
          this.ctx.moveTo(v.x,v.y);
          for (var iHalfedge=0; iHalfedge<nHalfedges; iHalfedge++) {
            var v2 = halfedges[iHalfedge].getEndpoint();
            this.ctx.lineTo(v2.x,v2.y);
            }         
          var color = this.ARR_COLORS[i];
          this.ctx.fillStyle = color;
          this.ctx.fill();
          }
        }   
        }

        // --- EDGES ---

        // this.ctx.beginPath();
        // this.ctx.strokeStyle = 'white';        
        // var edges = this.diagram.edges;
        // for(var i in edges){
        //  var edge = edges[i];
        //     v = edge.va;
        //     this.ctx.moveTo(v.x,v.y);
        //     v = edge.vb;
        //     this.ctx.lineTo(v.x,v.y);
        // }
        // this.ctx.stroke();
        
        // --- VERTEX ---
        
        // this.ctx.beginPath();
        // this.ctx.fillStyle = 'yellow';        
        // var vertices = this.diagram.vertices;
        // for (var i in vertices){
        //     var v = vertices[i];
        //     this.ctx.rect(v.x-2,v.y-2,4,4);
        // }
        // this.ctx.fill();

        // --- SITES ---

        // this.ctx.beginPath();
        // this.ctx.fillStyle = 'red';
        // var arr = this.sites;
        // for (var i in arr){
        //     var v = arr[i];
        //     this.ctx.rect(v.x-5,v.y-5,10,10);          
        // }
        // this.ctx.fill();
    } 
};


var ArtTexture = {
  init:function(arrColors) {
    this.arrColors = arrColors;
    return this;
  },
  get_texture:function(width,height,grid,noise) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;       
    var grid = grid?grid:15;
    var noise = noise!=="undefined"?noise:4;
    document.body.append(this.canvas);
    VoronoiImage.init(this.canvas,this.arrColors,{sites_grid:grid,sites_noise:noise});
    return this.canvas;
  } 
};


// var arrColors = ["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"];
// var JsonObject = JSON.stringify(arrColors);
// var arrColors = JSON.parse(JsonObject);
// var image = ArtTexture.init(arrColors).get_texture(400,400);

export {ArtTexture};
