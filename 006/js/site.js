

var Maket = {
	init:function(target) {


		this.$parent = $('#'+target);		
		this.CANVAS_HEIGHT = this.$parent.height();
		this.CANVAS_WIDTH = this.$parent.width();
		this.PARAM = {
			bgAlpha:true,
			ambient:0x777777,	
			lightIntensity:.6,		
		};

		this.ALL_READY = false;
		this.ALL_CUBES_READY = false;

		this.ARR_CUBES = [];

		this.build_scene();	
		this.build_camera();

		this.build_orbit_controls();				

		this.build_light();
		this.build_light_ambient();
		this.build_the_floor();
		
		this.build_cubes();

		this.behavior();
		this.animate();		

	},
	if_all_ready:function() {
		if(this.ALL_CUBES_READY){
			this.ALL_READY = true;		
		}
	},
	onPointerMove:function(event){
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		console.log(this.pointer.x,this.pointer.y);
	},
	behavior:function() {
		var _this=this;
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();

		window.addEventListener( 'pointermove', function(event){ _this.onPointerMove(event); } );

		document.addEventListener('keyup',(e)=>{						
			if (e.key == " " || e.code == "Space" || e.keyCode == 32 ) {
				this.ALL_READY && this.shuffle_cubes_pos();
			}			
		});		 



	},
	build_scene:function() {
		this.scene = new THREE.Scene();	
		
		// this.scene.background = new THREE.Color( 0x007F7F );	
		// this.scene.fog = new THREE.FogExp2( 0x007F7F, 0.1 );

		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:this.PARAM.bgAlpha});		
		this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );						
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.$parent[0].appendChild(this.renderer.domElement);
	},	
	build_camera:function() {
		this.camera = new THREE.PerspectiveCamera( 75, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 0.1, 1000 );
		this.camera.position.set(0,1,5);		
	},	
	build_orbit_controls:function() {
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		// this.controls.listenToKeyEvents( window ); // optional
		this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;		
		this.controls.screenSpacePanning = false;
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.minDistance = 1;
		this.controls.maxDistance = 5;
	},
	shuffle_cubes_pos:function() {
		var fied_size = 6;
		for(var i in this.ARR_CUBES){
			var posX = Math.random()*fied_size;
			var posY = Math.random()*fied_size;
			var cube = this.ARR_CUBES[i];			
			cube.position.set(posX-fied_size/2,0,posY-fied_size/2);			
		}			
	},
	build_cubes:function() {
		
		var texture = new THREE.TextureLoader().load( 'i/cube-01_.png' );			
		var  material = new THREE.MeshBasicMaterial( { map: texture } );

		var arr = Array.from(Array(10).keys());

		for(var i in arr){
			var fied_size = 6;
			var size =  Math.random()*.4+.2;						
			var r = Math.floor(Math.random()*254);
			var g = Math.floor(Math.random()*254);
			var b = Math.floor(Math.random()*254);
			var color = new THREE.Color("rgb("+r+", "+g+", "+b+")");
			var geometry = new THREE.BoxGeometry( size, size, size );
						
			var cube = new THREE.Mesh( geometry, material );
			this.ARR_CUBES.push(cube);			
			cube.castShadow = true; 						
			this.scene.add( cube );
		}
		this.shuffle_cubes_pos();		
		this.ALL_CUBES_READY = true;
		this.if_all_ready();
	},
	build_the_floor:function() {
		var geometry = new THREE.BoxGeometry( 3, .2, 3 );
		var material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );
		this.the_floor = new THREE.Mesh( geometry, material );
		this.the_floor.position.set(0,-1,0);
		this.the_floor.receiveShadow = true; 
		this.scene.add( this.the_floor );		
	},	
	build_light:function() {
		this.light = new THREE.DirectionalLight( 0xffffff, this.PARAM.lightIntensity );
		this.light.position.set(0,4,0);		
		this.light.castShadow = true;		
		this.scene.add( this.light );
		this.camera_helper = new THREE.CameraHelper( this.light.shadow.camera );
		this.scene.add( this.camera_helper );		
	},
	build_light_ambient:function() {
		this.amb_light = new THREE.AmbientLight( this.PARAM.ambient );
		this.scene.add( this.amb_light );				
	},
	animate:function() {
		
		var _this=this;
		for(var i in this.ARR_CUBES){			
			this.ARR_CUBES[i].rotation.x+=0.01;
			this.ARR_CUBES[i].rotation.z+=0.01;			
		}
		// this.cube.rotation.y += 0.01;
		// this.cube.rotation.x += 0.01;	
		// this.camera.rotation.z += -0.01;	

		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera( this.pointer, this.camera );
		// calculate objects intersecting the picking ray
		var intersects = this.raycaster.intersectObjects( this.scene.children );		
		for ( let i = 0; i < intersects.length; i ++ ) {
			intersects[ i ].object.material.color.set( 0xff0000 );
		}


		this.renderer.render( this.scene, this.camera );
		this.controls.update();

		window.requestAnimationFrame(function() {_this.animate();});		

	}
};


$(function(){

	Maket.init('scene3d');	

});