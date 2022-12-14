"use strict"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { ArtTexture } from 'mylib/ArtTexture.js';

var ArtGallery = {
  init:function(target,opt) {

    // this.$parent = $('#'+target);
    
    this.canvas = document.getElementById(target);

    this.CANVAS_HEIGHT = this.canvas.offsetHeight;
    this.CANVAS_WIDTH = this.canvas.offsetWidth;    
    
    this.IMG_PATH = opt.imgPath;
    this.BG_IMAGE = opt.bgImage;    

    this.PARAMS = {
      artBaseSize:20
    };

    this.ALL_ARTS = {};

    this.SPHERA_POINTS=[];

    this.build_scene();     
    this.build_sphera_art();
    this.build_arts_2();
    this.animation();

  },
  build_scene:function() {

    var _this=this;

      this.scene = new THREE.Scene();
      this.scene.rotation.y = 0.5; // avoid flying objects occluding the sun

      this.camera = new THREE.PerspectiveCamera( 60, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 1, 1000 );
      this.camera.position.z = 75;

      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );
      this.renderer.setAnimationLoop( this.animation.bind(this) );
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.canvas.appendChild( this.renderer.domElement );      

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.controls.autoRotate = true;

      window.addEventListener( 'resize', this.on_window_resized.bind(this) );      

      this.RGBE = new RGBELoader()
          .setPath( _this.IMG_PATH )
          .load( _this.BG_IMAGE, function ( texture ) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            _this.scene.background = texture;
            _this.scene.environment = texture;
          } );
      

  },
  build_sphera_art:function() {
        
      console.log("111");
        // textures

        var loader = new THREE.TextureLoader();
        var texture = loader.load( 'img/disc.png' );

        var group = new THREE.Group();
        this.scene.add( group );

        var dodecahedronGeometry = new THREE.DodecahedronGeometry( 20 );

        // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data
        dodecahedronGeometry.deleteAttribute( 'normal' );
        dodecahedronGeometry.deleteAttribute( 'uv' );

        dodecahedronGeometry = BufferGeometryUtils.mergeVertices( dodecahedronGeometry );

        var vertices = [];
        var positionAttribute = dodecahedronGeometry.getAttribute( 'position' );

        for ( var i = 0; i < positionAttribute.count; i ++ ) {
          var vertex = new THREE.Vector3();
          vertex.fromBufferAttribute( positionAttribute, i );
          vertices.push( vertex );
        }

        this.SPHERA_POINTS = vertices;

        // var pointsMaterial = new THREE.PointsMaterial( {
        //   color: 0x0080ff,
        //   map: texture,
        //   size: 1,
        //   alphaTest: 0.5
        // } );
        // var pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );
        // var points = new THREE.Points( pointsGeometry, pointsMaterial );
        // group.add( points );


  },
  build_arts_2:function() {
   
    var _this=this;

    var artGroup = new THREE.Group();    

    var TOTAL_SPUTNIKS = 7;
    var ARR_COLORS = ["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"];    

    var M_TEXTURED = Math.round(Math.random())+2;
    var M_WHITE = 2;
    var M_COLORED = TOTAL_SPUTNIKS - M_TEXTURED - M_WHITE;
    
    var baseSize = this.PARAMS.artBaseSize;
    var minSize = baseSize*.2;
    var maxSize = baseSize*.6;

    var foo = {
      get_textured_material:function() {
        var canvas = ArtTexture.init(ARR_COLORS).get_texture(300,300);        
        var image = canvas.toDataURL('image/png');    
        var loader = new THREE.TextureLoader();
        var texture = loader.load( image );
        return new THREE.MeshStandardMaterial( { map:texture, roughness: 0, metalness: 0 });
      },
      get_colored_material:function(color_string){
        var color = new THREE.Color(color_string);
        return new THREE.MeshStandardMaterial( { color:color, roughness: 0, metalness: 1});
      },
      get_random_cube:function(mode, index) {
        var size = Math.random() * (maxSize-minSize) + minSize;            
        var v = _this.SPHERA_POINTS[s_count];
        var pX = v.x;
        var pY = v.y;
        var pZ = v.z;
        var aX = Math.random()*360;
        var aY = Math.random()*360;
        var aZ = Math.random()*360;
        switch (mode) {
          case "textured":
            var current_material = textured_material;
          break;
          case "colored":
            var rnd = Math.round(Math.random()*(colored_materials.length-1));      
            var current_material = colored_materials[rnd];
          break;
          case "white":
            var current_material = white_materials;
          break;                      
        }        
        return _this.build_one_cube(size,current_material,[pX,pY,pZ],[aX,aY,aZ]);
      }
    };

    var textured_material = foo.get_textured_material();    
    var white_materials = foo.get_colored_material("white");    
    var colored_materials = [];
    for(var i in ARR_COLORS){
      colored_materials.push(foo.get_colored_material(ARR_COLORS[i]));
    }
    
    // LARGE CUBE IN CENTER
    var r = Math.random();
    var largeCube = this.build_one_cube(baseSize,textured_material,[0,0,0],[r,r,r]);
    artGroup.add(largeCube);

    var s_count = 0;
    this.SPHERA_POINTS.sort( () => .5 - Math.random());


    for (var i=0; i < M_TEXTURED; i++){
      var cube = foo.get_random_cube("textured",s_count);      
      artGroup.add(cube);
      s_count++;
    }

    for (var i=0; i < M_COLORED; i++){
      var cube = foo.get_random_cube("colored",s_count);
      artGroup.add(cube);
      s_count++;
    }    

    for (var i=0; i < M_WHITE; i++){
      var cube = foo.get_random_cube("white",s_count);
      artGroup.add(cube);
      s_count++;
    }        

    this.scene.add( artGroup );
    this.ALL_ARTS[artGroup['uuid']] = {name:"name-1",art:artGroup};
    

  },

  build_one_cube:function(size,material,pos,ang) { 
    var cube = new THREE.Mesh( new THREE.BoxGeometry( size, size, size ), material );
    cube.position.set(pos[0],pos[1],pos[2]);
    cube.rotation.set(ang[0],ang[1],ang[2]);
    return cube;
  },
  on_window_resized:function() {
      this.CANVAS_WIDTH = this.canvas.offsetWidth;
      this.CANVAS_HEIGHT = this.canvas.offsetHeight;    
      this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );
      this.camera.aspect = this.CANVAS_WIDTH / this.CANVAS_HEIGHT;
      this.camera.updateProjectionMatrix();    
  },
  animation:function(){
    var _this=this;
      
      this.controls.update();
      this.renderer.render( this.scene, this.camera );    


  }
};




export {ArtGallery};

