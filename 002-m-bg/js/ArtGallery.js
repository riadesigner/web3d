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
  build_arts:function() {

      var material = new THREE.MeshStandardMaterial( {
          roughness: 0,
          metalness: 1
        } );

      var cube = new THREE.Mesh( new THREE.BoxGeometry( 15, 15, 15 ), material );
      this.scene.add( cube );


    // var color = new THREE.Color("rgb(252, 255, 72)");      
    var texture = new THREE.TextureLoader().load( 'img/cube-01_.png' );
    // var material2 = new THREE.MeshBasicMaterial( { map: texture } );
 
      var material2 = new THREE.MeshStandardMaterial( {
          map:texture,
          // color:color,
          roughness: 0,
          metalness: 1
        } );

      var cube2 = new THREE.Mesh( new THREE.BoxGeometry( 15, 15, 15 ), material2 );
      cube2.position.set(0,18, 0);
      cube2.rotation.set(1,1, 0);
      this.scene.add( cube2 );      

    // this.amb_light = new THREE.AmbientLight( 'gray' );
    // this.scene.add( this.amb_light );       
    

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

