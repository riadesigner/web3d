

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

		this.build_scene();	

		this.build_light();
		this.build_light_ambient();
		
		this.ARR_CUBES = [];	

		this.build_cubes();

		this.build_the_floor();
		this.build_camera_helper();


		this.animate();		
	},
	build_scene:function() {

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 0.1, 1000 );		
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:this.PARAM.bgAlpha});		
		this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );				

		//add shadow param
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.$parent[0].appendChild(this.renderer.domElement);
		this.camera.position.set(0,1,3);
		this.camera.rotation.x += -0.4;
	},
	build_cubes:function() {
		var arr = [1,1,1,1,1,1,1];

		for(var i in arr){
			var size =  Math.random()*.8;
			var posX = Math.random()*6;
			var posY = Math.random()*6;
			var r = Math.floor(Math.random()*254);
			var g = Math.floor(Math.random()*254);
			var b = Math.floor(Math.random()*254);
			var color = new THREE.Color("rgb("+r+", "+g+", "+b+")");
			var geometry = new THREE.BoxGeometry( size, size, size );
			var material = new THREE.MeshStandardMaterial( { color: color } );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.set(posX-3,0,posY-3);
			this.ARR_CUBES.push(cube);
			cube.castShadow = true; 			
			this.scene.add( cube );		
		}
		
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
		//add shadow param
		this.light.castShadow = true;		
		this.scene.add( this.light );
	},
	build_camera_helper:function() {
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
			// this.ARR_CUBES[i].position.x+=0.01;
			// this.ARR_CUBES[i].position.z+=0.01;
			this.ARR_CUBES[i].rotation.x+=0.01;
			this.ARR_CUBES[i].rotation.z+=0.01;			
		}
		// this.cube.rotation.y += 0.01;
		// this.cube.rotation.x += 0.01;	
		// this.camera.rotation.z += -0.01;	
		
		this.renderer.render( this.scene, this.camera );		
		window.requestAnimationFrame(function() {
			_this.animate();
		});		
	}
};


$(function(){

	Maket.init('scene3d');	

});