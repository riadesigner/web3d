

var Maket = {
	init:function(target) {


		this.$parent = $('#'+target);		
		this.$BRAND_LABEL = $('#brand-title').hide();

		this.PARAM = {
			bgAlpha:true
		};

		this.mouseX = 0;
		this.mouseY = 0;

		this.update_size_canvas();	

		this.build_scene();	
		this.build_light();
		this.build_light_ambient();

		this.ALL_CUBES = {};

		
		this.cube = this.build_cube(1,[0,0,0]);
		this.ALL_CUBES[this.cube['uuid']] = {
			cube:this.cube,
			title:"GUCCI"
		} 

		this.cube1 = this.build_cube(.5,[0,-.2,1]);
		this.ALL_CUBES[this.cube1['uuid']] = {
			cube:this.cube1,
			title:"PRADA"
		} 		

		this.CURRENT_BRAND_TITLE = "---";

		this.build_the_floor();
		// this.build_camera_helper();		

		this.behavior();
		this.animate();	
		
	},
	update_brand_title:function(title,mode) {		
		if(this.CURRENT_BRAND_TITLE!==title){
			this.$BRAND_LABEL.html(title);
			this.CURRENT_BRAND_TITLE=title;
		};
		if(mode){
			this.$BRAND_LABEL.show();
			var x = this.mouseX-100- this.CANVAS_OFFSET_LEFT;
			var y = this.mouseY-100- this.CANVAS_OFFSET_TOP;
			this.$BRAND_LABEL.css({transform:'translate('+x+'px, '+y+'px)'});					
		}else{
			this.$BRAND_LABEL.hide();
		}

	},
	update_size_canvas:function() {		
		this.CANVAS_HEIGHT = this.$parent.height();
		this.CANVAS_WIDTH = this.$parent.width();
		this.CANVAS_OFFSET_TOP = this.$parent.offset().top;
		this.CANVAS_OFFSET_LEFT = this.$parent.offset().left;
	},
	onPointerMove:function(event) {				

		
		this.mouseX = event.pageX;
		this.mouseY = event.pageY;

		this.pointer.x = ( ( event.clientX - this.CANVAS_OFFSET_LEFT ) / this.CANVAS_WIDTH ) * 2 - 1;
		this.pointer.y = - ( ( event.clientY - this.CANVAS_OFFSET_TOP ) / this.CANVAS_HEIGHT ) * 2 + 1;		
		
		if(this.intersects){			
			
			if(this.intersects.length>0){

				for ( let i = 0; i < this.scene.children.length; i ++ ) {
					if(this.scene.children[i].isMesh){
						this.scene.children[ i ].material.color.set( 0x00ff00 );	
					}					
				}							

				this.intersects[ 0 ].object.material.color.set( 0xff0000 );
				var uuid = this.intersects[ 0 ].object['uuid'];				
				var title = this.ALL_CUBES[uuid]?this.ALL_CUBES[uuid].title:"–";				

				document.body.style.cursor = "pointer";
				this.update_brand_title(title,true);

			
			}else{
				
				for ( let i = 0; i < this.scene.children.length; i ++ ) {
					if(this.scene.children[i].isMesh){
						this.scene.children[ i ].material.color.set( 0x00ff00 );	
					}					
				}

				document.body.style.cursor = "default";
				this.update_brand_title("",false);
			}
		}

		

	},
	behavior:function() {
		var _this=this;
		
		this.$parent[0].addEventListener( 'pointermove', function(event){ _this.onPointerMove(event); });

	},
	build_scene:function() {
		
		var _this=this;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 0.1, 1000 );		
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:this.PARAM.bgAlpha});		
		this.renderer.setSize( this.CANVAS_WIDTH, this.CANVAS_HEIGHT );				

		//add shadow param
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// add hit test
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();		

		this.$parent[0].appendChild(this.renderer.domElement);
		this.camera.position.set(0,1,3);
		this.camera.rotation.x += -0.4;
	},
	build_cube:function(size, pos) {
		var cube;
		var geometry = new THREE.BoxGeometry( size, size, size );
		var material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		cube.castShadow = true; 
		cube.position.set(pos[0],pos[1],pos[2]);
		this.scene.add( cube );
		return cube;
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
		this.cube1.rotation.y += 0.01;
		this.cube1.rotation.x += 0.01;				
		
		this.renderer.render( this.scene, this.camera );

		this.raycaster.setFromCamera( this.pointer, this.camera );		
		this.intersects = this.raycaster.intersectObjects( this.scene.children );		
		
		
		window.requestAnimationFrame(function() {_this.animate();});		

	}
};


$(function(){

	Maket.init('scene3d');	

});