"use strict"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.min.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.min.js';
import { ArtTexture } from 'mylib/ArtTexture.js';
import { Hdr } from 'mylib/hdr.js';

var ArtGallery = {
  init:function(target,opt) {

    
    this.canvas = document.getElementById(target);
    this.brand_label = document.getElementById(opt.brandTitle);

    this.brand_label.style.display = "none";     

    this.recalc_canvas();

    this.IMG_PATH = opt.imgPath;
    this.BG_IMAGE = opt.bgImage; 
    this.REFLECT_IMAGE = opt.refImage;
    this.btnLeft = document.getElementById(opt.btnLeft);
    this.btnRight = document.getElementById(opt.btnRight);
    this.noteWin = document.getElementById(opt.noteWin);
    this.btnCloseNote = document.getElementById(opt.btnCloseNote);

    this.PARAMS = {
      artBaseSize:20,
      autoRotateSpeed:.2
    };

    this.POINTER_MOVED = false;

    this.ALL_ARTS = [];

    this.CURRENT_BRAND_TITLE = "";

    this.SPHERA_POINTS=[];

    this.preload_textures({
      onReady:()=>{
        console.log('this.TEXTURES',this.TEXTURES)        
        this.build_scene();
        this.build_sphera_art();
        this.build_all_arts();
        this.animation();
        this.behavior();
      }
    });
  },

  preload_textures:function(opt) {


    this.TEXTURES = {};

    Promise.all([

            Hdr.load(this.IMG_PATH+this.BG_IMAGE),
            Hdr.load(this.IMG_PATH+this.REFLECT_IMAGE)

        ]).then((images)=>{

            this.TEXTURES['bg'] = images[0];
            this.TEXTURES['ref'] = images[1];
        
            opt && opt.onReady();
    });
   

  },
  behavior:function() {
  
    var _this=this; 
      
    this.btnRight.addEventListener('pointerdown',()=>{ this.close_note_win(); this.controls.autoRotateSpeed = 20; },false);
    this.btnRight.addEventListener('pointerup',()=>{ this.controls.autoRotateSpeed = this.PARAMS.autoRotateSpeed; },false);
    
    this.btnLeft.addEventListener('pointerdown',()=>{ this.close_note_win(); this.controls.autoRotateSpeed=-20; },false);
    this.btnLeft.addEventListener('pointerup',()=>{ this.controls.autoRotateSpeed = this.PARAMS.autoRotateSpeed; },false);        
    
    this.btnCloseNote.addEventListener('click',()=>{ this.close_note_win(); });

    this.canvas.addEventListener( 'pointermove', (event)=>{ this.onPointerMove(event);  }); 
    this.canvas.addEventListener( 'pointerdown', (event)=>{ this.on_canvas_press(event);}); 
    this.canvas.addEventListener( 'pointerup', ()=>{ !this.POINTER_MOVED && this.on_art_clicked();}); 
    window.addEventListener( 'resize', this.on_window_resized.bind(this) );

  
  },
  close_note_win:function() {
    if(this.noteWin.style.display!=='none')
    this.noteWin.style.display = 'none';
  },
  on_art_clicked:function() {
    if(this.CURRENT_BRAND && this.CURRENT_BRAND_TITLE!==""){      
      document.location.href = this.CURRENT_BRAND.link;
    }    
  },
  on_canvas_press:function(event) {
    this.POINTER_MOVED = false;
  },
  onPointerMove:function(event) {   

    this.POINTER_MOVED = true;

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
        
        // ARR_BRANDS
          this.CURRENT_BRAND = this.get_brand_by_uuid(uuid);                    
          if(this.CURRENT_BRAND){
            this.update_brand_title(this.CURRENT_BRAND.name,true);  
          }else{
            this.update_brand_title("",false);
          }
        }
      }else{        
        this.update_brand_title("",false);
      }
    }

  },  
  build_all_arts:function() {

    var ARR_BRANDS = [
        // {name:"Alexander Varlakov",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"]},
        {name:"Ermolenko",colors:['#060811','#333845','#373C4C','#8B726E','#B1B8C3','#EFF2F2'],link:'https://cyber-brand.ru/collections/ermolenko-kollekcziya//#collections-menu'},
        {name:"Zhogova",colors:['#2B477D','#2C3B6D','#304075','#324175','#A4452D','#E2E5EB'],link:'https://cyber-brand.ru/collections/zhogova//#collections-menu'},
        {name:"Natalya Lopatkina",colors:['#11131A','#3D2E28','#918A8C','#938770','#C7A364','#E4EAF1'],link:'https://cyber-brand.ru/collections/natalya-lopatkina-kollekcziya//#collections-menu'},
        {name:"AKULINA IRINA",colors:['#72A6DA','#8E847B','#BEB2B6','#CEB59B','#DBE3EB','#EEF1EE'],link:'https://cyber-brand.ru/collections/akulina-irina-kollekcziya//#collections-menu'},
        // {name:"Danishine",colors:["#cc0033","#ff5566","#22aaff","#cc88ee","#ff0022","#3344ee"]},

        {name:"Лесозаводский",colors:['#010204','#20283A','#CCD2DC','#DADFE9','#DBE3EB','#E9EBF2'],link:'https://cyber-brand.ru/collections/ooo-lesozavodskij-promyshlennyj-kombinat%e2%88%92-poshiv-kollekcziya/'},
        {name:"Владивосток ",colors:['#37467E','#4A9BCF','#A6BBE1','#D4DFEA','#DADCE4','#DCE4EC'],link:'https://cyber-brand.ru/collections/shvejnaya-fabrika-vladivostok-2//#collections-menu'},
        {name:"Хлопок",colors:['#8C4F5E','#B5CDE1','#BE9794','#CCA53E','#D5AE44','#DAB4B1'],link:'https://cyber-brand.ru/collections/hlopok-kollekcziya//#collections-menu'},
        {name:"Design_2204",colors:['#1A191F','#2F439B','#666CC0','#762B33','#D0C9D3','#EFF2F2'],link:'https://cyber-brand.ru/collections/design_2204-kollekcziya//#collections-menu'},
        {name:"DIA",colors:['#323533','#4C4551','#576B27','#705F6C','#827A77','#8C795A'],link:'https://cyber-brand.ru/collections/dia-kollekcziya//#collections-menu'},
        {name:"Люди в Худи",colors:['#2E679F','#651815','#756C8A','#DBE3EB','#E1C8CF','#E35FA1'],link:'https://cyber-brand.ru/collections/lyudi-v-hudi-kollekcziya//#collections-menu'},


        {name:"GETCLO",colors:['#8E6663','#919385','#977978','#BEC5D1','#BFBEBB','#EEF2F8'],link:'https://cyber-brand.ru/collections/letnyaya-kollekcziya-getclo//#collections-menu'},
        {name:"GAUR",colors:['#181419','#293321','#2A252C','#76291D','#AFA7A5'],link:'https://cyber-brand.ru/collections/gaur-kollekcziya//#collections-menu'},
        {name:"Nastas’a Fasonova",colors:['#1D201F','#1D2234','#932529','#93928E','#EAECF2','#F7F4F5'],link:'https://cyber-brand.ru/collections/nastasa-fasonova-kollekcziya//#collections-menu'},
        // {name:"IVAN FEDOROV",colors:["#334499","#6677ee","#aabb00","#aa00bb","#00aaff","#aa44dd"]},
        {name:"Kiwi.dress",colors:['#040406','#0A0C16','#D0BCB1','#E9EBF2','#ECEEF4','#F2F4F9'],link:'https://cyber-brand.ru/collections/kiwi-dress-kollekcziya//#collections-menu'},
        {name:"YANVAR’",colors:['#131315','#18161C','#8C8575','#BEB5BA','#D5C4B6','#E1E6EB'],link:'https://cyber-brand.ru/collections/yanvar/#collections-menu'},  

        // {name:"ЧЕРДАКFOREVER",colors:["#ffcc00","#aadd33","#4477ff","#0033ff","#114433","#ccddaa"]},
        {name:"BEGINNING",colors:['#202020','#3A2C22','#5D6169','#5D8B8E','#909099','#9A9A9A'],link:'https://cyber-brand.ru/collections/beginning-kollekcziya/#collections-menu'},
        // {name:"Мистер Ежик",colors:["#eeffee","#eedd44","#00ff55","#1100aa","#aaff00","#cc7777"]},
        {name:"KUZMA",colors:['#20253D','#42343B','#5E533C','#719D75','#7F5F2C','#A28483'],link:'https://cyber-brand.ru/collections/kuzma-kollekcziya//#collections-menu'},
        {name:"DAP’86",colors:['#1B1814','#1F1F26','#9C9BA7','#ACB1BC','#AEB3C0','#DBE669'],link:'https://cyber-brand.ru/collections/dap86-kollekcziya//#collections-menu'},
        {name:"LOPKHAN",colors:['#100E0F','#BCA96F','#C1BCB0','#DADEE2','#E3E8EA','#EADB55'],link:'https://cyber-brand.ru/collections/lopkhan-kollekcziya//#collections-menu'},                       

        {name:"Goranskaya",colors:['#0E1C2E','#131F27','#39413E','#49A0C4','#B0C3CE','#B52C31'],link:'https://cyber-brand.ru/collections/goranskaya-kollekcziya//#collections-menu'},
        {name:"Axefeel",colors:['#1C2230','#4396E3','#71D14F','#A13855','#DFE3E9','#EF8ADE'],link:'https://cyber-brand.ru/collections/axefeel-kollekcziya//#collections-menu'},
        {name:"SANDRA&MICHELLE",colors:['#7F5665','#801C1B','#888E9D','#9D9C8F','#BBA8B6','#BFC2C3'],link:'https://cyber-brand.ru/collections/sandramichelle-kollekcziya/'},
        {name:"Sokolova",colors:['#15181B','#265351','#2B636A','#423F3A','#B9BFDD','#CBCAC5'],link:'https://cyber-brand.ru/collections/sokolova-kollekcziya/#collections-menu'},
        {name:"Razuvan",colors:['#0F1318','#303030','#357984','#3F8B99','#71AEB6','#9ACDD0'],link:'https://cyber-brand.ru/collections/razuvan-kollekcziya//#collections-menu'},
        {name:"OXA",colors:['#4C2C37','#A29FA5','#BC9BB6','#C0BEC9','#CCBEB5','#DCCABC'],link:'https://cyber-brand.ru/collections/oha-collection//#collections-menu'},       

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
        this.ALL_ARTS.push({name : brand.name, art : art, arr_uuid : arr_uuid, link:brand.link });       

        
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
      this.camera.position.z = 130;

      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );
      this.renderer.setAnimationLoop( this.animation.bind(this) );
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.canvas.appendChild( this.renderer.domElement );      



      this.controls = new OrbitControls( this.camera, this.renderer.domElement );      
      this.controls.listenToKeyEvents( window ); // optional
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.05;   
      this.controls.screenSpacePanning = false;
      // this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 50;
      this.controls.maxDistance = 230;      
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = this.PARAMS.autoRotateSpeed;

      this.controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
   

      // add hit test
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();         


      this.TEXTURES['bg'].mapping = THREE.EquirectangularReflectionMapping;
      this.TEXTURES['ref'].mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = this.TEXTURES['bg'];
      this.scene.environment = this.TEXTURES['ref'];

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
  recalc_canvas:function() {
      this.CANVAS_WIDTH = this.canvas.offsetWidth;
      this.CANVAS_HEIGHT = this.canvas.offsetHeight;    
      var offset = this.getOffset(this.canvas);
      this.CANVAS_OFFSET_TOP = offset.top;
      this.CANVAS_OFFSET_LEFT = offset.left;
  },
  on_window_resized:function() {
      this.recalc_canvas();
      this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );
      this.camera.aspect = this.CANVAS_WIDTH / this.CANVAS_HEIGHT;
      this.camera.updateProjectionMatrix();    
  },
  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  },  
  animation:function(){
            

      this.controls.update();
      this.renderer.render( this.scene, this.camera );    
      this.raycaster.setFromCamera( this.pointer, this.camera );    
      this.intersects = this.raycaster.intersectObjects( this.scene.children );         


  },
  get_brand_by_uuid:function(uuid) {
    var b = false;    
    for(var i in this.ALL_ARTS){
      var arr_uuid = this.ALL_ARTS[i].arr_uuid;      
      var index = arr_uuid.indexOf(uuid);
      if(index>-1){
        b = this.ALL_ARTS[i];        
      }
    };
    return b;    
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

