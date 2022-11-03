"use strict"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

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

        var pointsMaterial = new THREE.PointsMaterial( {
          color: 0x0080ff,
          map: texture,
          size: 1,
          alphaTest: 0.5
        } );

        var pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

        var points = new THREE.Points( pointsGeometry, pointsMaterial );
        group.add( points );


  },
  build_arts_2:function() {
   

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

    var baseSize = this.PARAMS.artBaseSize;
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

    console.log('this.SPHERA_POINTS',this.SPHERA_POINTS);
    console.log('baseSize',baseSize);

    this.SPHERA_POINTS.sort( () => .5 - Math.random());

    for (var i=0; i<7; i++){
      var size = Math.random() * (maxSize-minSize) + minSize;
            
      var v = this.SPHERA_POINTS[i];

      var pX = v.x;
      var pY = v.y;
      var pZ = v.z;           

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

    var baseSize = this.PARAMS.artBaseSize;
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
