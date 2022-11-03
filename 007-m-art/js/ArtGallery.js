"use strict"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

var ArtGallery = {
  init:function(target,opt) {

    // this.$parent = $('#'+target);
    
    this.canvas = document.getElementById(target);

    this.CANVAS_HEIGHT = this.canvas.offsetHeight;
    this.CANVAS_WIDTH = this.canvas.offsetWidth;    
    
    this.IMG_PATH = opt.imgPath;
    this.BG_IMAGE = opt.bgImage;    

    this.ALL_ARTS = {};

    this.build_scene(); 
    this.build_arts();
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
  build_arts_by_json:function() {
    // var ArrArts = '[{"size":10,"pos":[0,0,0],"ang":[0,0,0],"textured":true,"color":"","roughness":0,"metalness":0},{"size":6.4282669814719515,"pos":[-1.3662443169997829,-5.424406569627327,7.54312206639009],"ang":[252.59668688535248,328.49278716159307,179.5610681820214],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":4.453913226353142,"pos":[-5.622420722777064,2.9608603531534072,-4.741115879793454],"ang":[75.87444985922181,308.56465868745397,36.04996057314442],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":4.3232766365740005,"pos":[9.837734229808675,6.262901853993409,3.8205089897773306],"ang":[75.7961940489676,14.652524194504508,7.007141544894466],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":7.7399609092910655,"pos":[2.365799312903958,-7.6764286928648495,-3.2025746539811495],"ang":[111.9387969063832,167.5875278812737,246.13450209208608],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":7.546533898890793,"pos":[-5.576264173345127,1.1913121950263026,0.3884816432653473],"ang":[48.5940382549088,111.53886412089781,52.78193732890007],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":7.395581021989985,"pos":[5.657863683569335,-7.285468468012808,3.163762713456318],"ang":[226.31308785903394,330.19988040143375,359.366127905853],"textured":false,"color":"white","roughness":0,"metalness":1},{"size":3.930495191039522,"pos":[-1.1026612533299982,9.92001444796799,2.0434667654405416],"ang":[148.3901475363021,198.84303311185448,125.05259805380662],"textured":false,"color":"white","roughness":0,"metalness":1}]';

    var artMap = JSON.parse(ArrArts);

    var artGroup = new THREE.Group();    


    // var baseSize = 10;
    // var minSize = baseSize*.3;
    // var maxSize = baseSize*.8;

    // var color = new THREE.Color("rgb(115, 208, 251)");

    var material_textured = new THREE.MeshStandardMaterial( {
        // map:texture,
        color:color,
        roughness: 0,
        metalness: 0
      } );    

    var material = new THREE.MeshStandardMaterial( {
        // map:texture,
        // color:color,
        roughness: 0,
        metalness: 1
      } );        
    var r = Math.random()*1;
    var largeCube = this.build_one_cube(baseSize,material_textured,[0,0,0],[r,r,r]);
    artGroup.add(largeCube);

    foo.addToArt(baseSize,[0,0,0],[0,0,0],true,"",0,0);

    console.log('baseSize',baseSize);
    for (var i=0; i<7; i++){
      var size = Math.random() * (maxSize-minSize) + minSize;
      console.log('size',size);
      var pX = Math.random()*baseSize*2 - baseSize;
      var pY = Math.random()*baseSize*2 - baseSize;
      var pZ = Math.random()*baseSize*2 - baseSize;
      var aX = Math.random()*360;
      var aY = Math.random()*360;
      var aZ = Math.random()*360;
      var cube = this.build_one_cube(size,material,[pX,pY,pZ],[aX,aY,aZ]);
      artGroup.add(cube);

      foo.addToArt(size,[pX,pY,pZ],[aX,aY,aZ],false,"white",0,1);

    }

    this.scene.add( artGroup );
    this.ALL_ARTS[artGroup['uuid']] = {name:"name-1",art:artGroup};

    // var JsonObject = JSON.parse(JSON.stringify(artMap));
    // console.log(JsonObject);


  },
  build_arts:function() {
   

    var artGroup = new THREE.Group();

    var artMap = [];

    var foo = {
      addToArt:function(size,pos,ang) {
          artMap.push({
            s:size.toFixed(2),
            p:[pos[0].toFixed(2),pos[1].toFixed(2),pos[2].toFixed(2)],
            a:[Math.floor(ang[0]),Math.floor(ang[1]),Math.floor(ang[2])]
          });
      }
    };

    var baseSize = 10;
    var minSize = baseSize*.3;
    var maxSize = baseSize*.8;

    var color = new THREE.Color("rgb(115, 208, 251)");

    var material_textured = new THREE.MeshStandardMaterial( {
        // map:texture,
        color:color,
        roughness: 0,
        metalness: 0
      } );    

    var material = new THREE.MeshStandardMaterial( {
        // map:texture,
        // color:color,
        roughness: 0,
        metalness: 1
      } );        
    var r = Math.random()*1;
    var largeCube = this.build_one_cube(baseSize,material_textured,[0,0,0],[r,r,r]);
    artGroup.add(largeCube);

    foo.addToArt(baseSize,[0,0,0],[0,0,0]);

    console.log('baseSize',baseSize);
    for (var i=0; i<7; i++){
      var size = Math.random() * (maxSize-minSize) + minSize;
      console.log('size',size);
      var pX = Math.random()*baseSize*2 - baseSize;
      var pY = Math.random()*baseSize*2 - baseSize;
      var pZ = Math.random()*baseSize*2 - baseSize;
      var aX = Math.random()*360;
      var aY = Math.random()*360;
      var aZ = Math.random()*360;
      var cube = this.build_one_cube(size,material,[pX,pY,pZ],[aX,aY,aZ]);
      artGroup.add(cube);

      foo.addToArt(size,[pX,pY,pZ],[aX,aY,aZ]);

    }

    this.scene.add( artGroup );
    this.ALL_ARTS[artGroup['uuid']] = {name:"name-1",art:artGroup};

    // var JsonObject = JSON.parse(JSON.stringify(artMap));
    // console.log(JsonObject);

    $('#description textarea').val(JSON.stringify(artMap));
    

  },
  build_one_cube:function(size,material,pos,ang) {    

    var cube = new THREE.Mesh( new THREE.BoxGeometry( size, size, size ), material );    
    // cube.castShadow = true;                 
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

