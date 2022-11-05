"use strict"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { ArtTexture } from 'mylib/ArtTexture.js';

var ArtGallery = {
  init:function(target,brand_label,opt) {

    
    
    this.canvas = document.getElementById(target);
    this.brand_label = document.getElementById(brand_label);

    this.brand_label.style.display = "none";     

    this.CANVAS_HEIGHT = this.canvas.offsetHeight;
    this.CANVAS_WIDTH = this.canvas.offsetWidth;    

    this.CANVAS_OFFSET_LEFT = 0;
    this.CANVAS_OFFSET_TOP = 0;
    
    this.IMG_PATH = opt.imgPath;
    this.BG_IMAGE = opt.bgImage;    

    this.PARAMS = {
      artBaseSize:20
    };

    this.ALL_ARTS = [];

    this.CURRENT_BRAND_TITLE = "";

    this.SPHERA_POINTS=[];

    this.build_scene();     
    this.build_sphera_art();
    this.build_all_arts();
    this.animation();
    this.behavior();

  },
  behavior:function() {
  
    var _this=this; 
    this.canvas.addEventListener( 'pointermove', function(event){ _this.onPointerMove(event); }); 
    this.canvas.addEventListener( 'pointerup', function(event){ console.log("click"); }); 
    window.addEventListener( 'resize', this.on_window_resized.bind(this) );
  
  },
  build_all_arts:function() {

    var ARR_BRANDS = [
        // {name:"Alexander Varlakov",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"]},
        {name:"Ermolenko",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/ermolenko-kollekcziya//#collections-menu'},
        {name:"Zhogova",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"],link:'https://cyber-brand.ru/collections/zhogova//#collections-menu'},
        {name:"Natalya Lopatkina",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"],link:'https://cyber-brand.ru/collections/natalya-lopatkina-kollekcziya//#collections-menu'},
        {name:"AKULINA IRINA",colors:["#770044","#449900","#eeff77","#ee0000","#ffaa00","#dd2288"],link:'https://cyber-brand.ru/collections/akulina-irina-kollekcziya//#collections-menu'},
        // {name:"Danishine",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"]},

        {name:"Лесозаводский",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"],link:'https://cyber-brand.ru/collections/ooo-lesozavodskij-promyshlennyj-kombinat%e2%88%92-poshiv-kollekcziya/'},
        {name:"Владивосток ",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/shvejnaya-fabrika-vladivostok-2//#collections-menu'},
        {name:"Хлопок",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"],link:'https://cyber-brand.ru/collections/hlopok-kollekcziya//#collections-menu'},
        {name:"Design_2204",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"],link:'https://cyber-brand.ru/collections/design_2204-kollekcziya//#collections-menu'},
        {name:"DIA",colors:["#770044","#449900","#eeff77","#ee0000","#ffaa00","#dd2288"],link:'https://cyber-brand.ru/collections/dia-kollekcziya//#collections-menu'},
        {name:"Люди в Худи",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/lyudi-v-hudi-kollekcziya//#collections-menu'},

        {name:"GETCLO",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"],link:'https://cyber-brand.ru/collections/letnyaya-kollekcziya-getclo//#collections-menu'},
        {name:"GAUR",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/gaur-kollekcziya//#collections-menu'},
        {name:"Nastas’a Fasonova",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"],link:'https://cyber-brand.ru/collections/nastasa-fasonova-kollekcziya//#collections-menu'},
        // {name:"IVAN FEDOROV",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"]},
        {name:"Kiwi.dress",colors:["#770044","#449900","#eeff77","#ee0000","#ffaa00","#dd2288"],link:'https://cyber-brand.ru/collections/kiwi-dress-kollekcziya//#collections-menu'},
        {name:"YANVAR’",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/yanvar/#collections-menu'},  

        // {name:"ЧЕРДАКFOREVER",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"]},
        {name:"BEGINNING",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/beginning-kollekcziya/#collections-menu'},
        // {name:"Мистер Ежик",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"]},
        {name:"KUZMA",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"],link:'https://cyber-brand.ru/collections/kuzma-kollekcziya//#collections-menu'},
        {name:"DAP’86",colors:["#770044","#449900","#eeff77","#ee0000","#ffaa00","#dd2288"],link:'https://cyber-brand.ru/collections/dap86-kollekcziya//#collections-menu'},
        {name:"LOPKHAN",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/lopkhan-kollekcziya//#collections-menu'},                       

        {name:"Goranskaya",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"],link:'https://cyber-brand.ru/collections/goranskaya-kollekcziya//#collections-menu'},
        {name:"Axefeel",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/axefeel-kollekcziya//#collections-menu'},
        {name:"SANDRA&MICHELLE",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"],link:'https://cyber-brand.ru/collections/sandramichelle-kollekcziya/'},
        {name:"Sokolova",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"],link:'https://cyber-brand.ru/collections/sokolova-kollekcziya/#collections-menu'},
        {name:"Razuvan",colors:["#770044","#449900","#eeff77","#ee0000","#ffaa00","#dd2288"],link:'https://cyber-brand.ru/collections/razuvan-kollekcziya//#collections-menu'},
        {name:"OXA",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"],link:'https://cyber-brand.ru/collections/oha-collection//#collections-menu'},       

      ];    


    var COLUMS = 6;
    var k = ARR_BRANDS.length%COLUMS;
    var ROWS = (ARR_BRANDS.length-k)/COLUMS + (k?1:0); 
    var ART_SIZE = 60;
    
    this.GALLERY = new THREE.Group();        

    for(var i=0;i<ROWS;i++){
      for(var j=0;j<COLUMS;j++){        
        var pos = j+COLUMS*i;
        var brand = ARR_BRANDS[pos];
        if(!brand) break;

        var ART_OBJECT = this.build_art(brand.colors);
        var art = ART_OBJECT.art;
        var arr_uuid = ART_OBJECT.arr_uuid;        
        this.ALL_ARTS.push({name : brand.name, art : art, arr_uuid : arr_uuid });        
        
        var CHESS = i%2>0 ? 0 : ART_SIZE/2;
        var rnd = Math.random()*ART_SIZE;
        var POS_Y = Math.random() < .5 ? rnd:-rnd; 

        art.position.set(j*ART_SIZE + CHESS, POS_Y, -i*ART_SIZE);        
        
        this.GALLERY.add(art);

      }      
    };
    var X_CENTER = -ART_SIZE*COLUMS/2+ART_SIZE/2;
    this.GALLERY.position.set(X_CENTER,0,-X_CENTER+ART_SIZE/2); 
    this.scene.add( this.GALLERY );
    
      
  },  
  build_scene:function() {

    var _this=this;

      this.scene = new THREE.Scene();
      this.scene.rotation.y = -0.2; // avoid flying objects occluding the sun

      this.camera = new THREE.PerspectiveCamera( 60, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 1, 1000 );
      this.camera.position.z = 100;

      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );
      this.renderer.setAnimationLoop( this.animation.bind(this) );
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.canvas.appendChild( this.renderer.domElement );      

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );      
      // this.controls.listenToKeyEvents( window ); // optional
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.05;   
      this.controls.screenSpacePanning = false;
      // this.controls.maxPolarAngle = Math.PI / 2;
      // this.controls.minDistance = 1;
      // this.controls.maxDistance = 5;      
      // this.controls.autoRotate = true;

      // add hit test
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();         

      this.RGBE = new RGBELoader()
          .setPath( _this.IMG_PATH )
          .load( _this.BG_IMAGE, function ( texture ) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            _this.scene.background = texture;
            _this.scene.environment = texture;
          } );
      

  },
  build_sphera_art:function() {
        
        var dodecahedronGeometry = new THREE.DodecahedronGeometry( 20 );
        // if normal and uv attributes are not removed, mergeVertices() 
        // can't consolidate indentical vertices with different normal/uv data
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

  },
  build_art:function(arr_colors) {
   
    var _this=this;

    var arr_uuid = [];
    var artGroup = new THREE.Group();    

    var TOTAL_SPUTNIKS = 7;
    var ARR_COLORS = arr_colors;

    var M_TEXTURED = Math.round(Math.random())+2;
    var M_WHITE = 2;
    var M_COLORED = TOTAL_SPUTNIKS - M_TEXTURED - M_WHITE;
    
    var baseSize = this.PARAMS.artBaseSize;
    var minSize = baseSize*.2;
    var maxSize = baseSize*.6;

    var foo = {
      get_textured_material:function() {
        var image = ArtTexture.init(ARR_COLORS).get_texture(300,300);                
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
    arr_uuid.push(largeCube['uuid']);
    artGroup.add(largeCube);


    // SPUTNIKS CUBES
    var s_count = 0;
    this.SPHERA_POINTS.sort( () => .5 - Math.random());

    for (var i=0; i < M_TEXTURED; i++){
      var cube = foo.get_random_cube("textured",s_count);      
      arr_uuid.push(cube['uuid']);
      artGroup.add(cube);
      s_count++;
    };

    for (var i=0; i < M_COLORED; i++){
      var cube = foo.get_random_cube("colored",s_count);
      arr_uuid.push(cube['uuid']);
      artGroup.add(cube);
      s_count++;
    };   

    for (var i=0; i < M_WHITE; i++){
      var cube = foo.get_random_cube("white",s_count);
      arr_uuid.push(cube['uuid']);
      artGroup.add(cube);
      s_count++;
    };

    return {art:artGroup,arr_uuid:arr_uuid};

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
          
      this.controls.update();
      this.renderer.render( this.scene, this.camera );    
      this.raycaster.setFromCamera( this.pointer, this.camera );    
      this.intersects = this.raycaster.intersectObjects( this.scene.children );         

  },
  get_brand_name_by_uuid:function(uuid) {
    var b_name = "NO NAME";    
    for(var i in this.ALL_ARTS){
      var arr_uuid = this.ALL_ARTS[i].arr_uuid;      
      var index = arr_uuid.indexOf(uuid);
      if(index>-1){
        b_name = this.ALL_ARTS[i].name;        
      }
    };
    return b_name;    
  },
  onPointerMove:function(event) {       

    this.mouseX = event.pageX;
    this.mouseY = event.pageY;

    this.pointer.x = ( ( event.clientX - this.CANVAS_OFFSET_LEFT ) / this.CANVAS_WIDTH ) * 2 - 1;
    this.pointer.y = - ( ( event.clientY - this.CANVAS_OFFSET_TOP ) / this.CANVAS_HEIGHT ) * 2 + 1;   
    
    if(this.intersects){      
      
      if(this.intersects.length>0){

        // this.intersects[ 0 ].object.material.color.set( 0xff0000 );
        var uuid = this.intersects[ 0 ].object['uuid'];       
        var mesh = this.intersects[ 0 ].object.isMesh ? "объект":"";
        if(mesh){

          var BRAND_NAME = this.get_brand_name_by_uuid(uuid);                    
          this.update_brand_title(BRAND_NAME,true);

        }
      }else{        
        this.update_brand_title("",false);
      }
    }

  },
  update_brand_title:function(title,mode) {   
    if(this.CURRENT_BRAND_TITLE!==title){      
      this.brand_label.innerHTML = title;
      this.CURRENT_BRAND_TITLE=title;
    };
    if(mode){
      document.body.style.cursor = "pointer";
      this.brand_label.style.display="block";
      var x = this.mouseX-100- this.CANVAS_OFFSET_LEFT;
      var y = this.mouseY-100- this.CANVAS_OFFSET_TOP;
      this.brand_label.style.transform = 'translate('+x+'px, '+y+'px)';         
    }else{
      document.body.style.cursor = "default";
      this.brand_label.style.display="none";
    }

  }  

};




export {ArtGallery};

