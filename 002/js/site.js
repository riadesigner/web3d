

var Maket = {
	init:function(target) {


		this.$parent = $('#'+target);		
		this.CANVAS_HEIGHT = this.$parent.height();
		this.CANVAS_WIDTH = this.$parent.width();

		this.build_scene();	
		this.build_cube();
		this.animate();		
	},
	build_scene:function() {

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 0.1, 1000 );		
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});		
		this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );				
		this.$parent[0].appendChild(this.renderer.domElement);
	},
	build_cube:function() {
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );
		this.camera.position.z = 5;
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