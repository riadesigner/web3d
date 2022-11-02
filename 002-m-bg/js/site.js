

var Maket = {
	init:function(target) {


		this.$parent = $('#'+target);		
		this.CANVAS_HEIGHT = this.$parent.height();
		this.CANVAS_WIDTH = this.$parent.width();
		this.PARAM = {
			bgAlpha:true
		};

		this.build_scene();	
		this.build_light();
		this.build_light_ambient();
		
		this.build_cube();
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
	build_cube:function() {
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
		this.cube = new THREE.Mesh( geometry, material );
		this.cube.castShadow = true; 

		this.scene.add( this.cube );		
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
		this.light = new THREE.DirectionalLight( 0xffffff, .6 );
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
		this.amb_light = new THREE.AmbientLight( 0x777777 );
		this.scene.add( this.amb_light );				
	},
	animate:function() {
		
		var _this=this;
		this.cube.rotation.y += 0.01;
		this.cube.rotation.x += 0.01;		
		
		this.renderer.render( this.scene, this.camera );		
		window.requestAnimationFrame(function() {
			_this.animate();
		});		
	}
};


$(function(){

	Maket.init('scene3d');	

});