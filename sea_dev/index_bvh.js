window.onload = init;

//var bodyLink = "http://jsrun.it/assets/8/h/4/7/8h47g";
var bodyLink = "avatar.sea";

var out1, out2, debug;
var vsize, camPos, lightPos, mouse;
var camera, container, scene, renderer, delta, center, centerLight, clock;
var ToRad = Math.PI / 180;
var ToDeg = 180 / Math.PI;
var hero;
var helperSquel = null;
var bones = null;
var preservesBoneSize = true;

var bvhReader;
var BVHanimConfig = { debug:true, speed:0.5, size:1, px:0, py:0, pz:0, boneSize:0.4 };

function init() {
    out1 = document.getElementById("ou1");
    out2 = document.getElementById("out2");
    debug = document.getElementById("debug");
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById("b1").addEventListener( 'click', function ( e ) {BVHanimConfig.speed=0.5; loadBVH("http://jsrun.it/assets/b/Y/h/R/bYhRW.png"); }, false );
    document.getElementById("b2").addEventListener( 'click', function ( e ) {BVHanimConfig.speed=1; loadBVH("http://jsrun.it/assets/5/i/E/G/5iEGG.png"); }, false ); 
    document.getElementById("b3").addEventListener( 'click', function ( e ) {heroVisibility(); }, false );
    document.getElementById("b4").addEventListener( 'click', function ( e ) {skeletonVisibility(); }, false );
    
     
    vsize = new THREE.Vector3();
    vsize.x = window.innerWidth;
	vsize.y = window.innerHeight;
	vsize.z = vsize.x / vsize.y;

	camPos = { horizontal: 120, vertical: 70, distance: 200, automove: false };
	lightPos = { horizontal: 135, vertical: 35, distance: 200 };
    mouse = { ox:0, oy:0, h:0, v:0, mx:0, my:0, down:false, over:false, moving:true, dx:0, dy:0 };
	
	init3D();
    animate();
}

function handleFileSelect(evt) {
    var f = evt.target.files[0];
	var reader = new FileReader();
	reader.onload = (function(theFile) { return function(e) { bvhReader.parseData(e.target.result.split(/\s+/g));}; })(f);
	reader.readAsText(f);
}

function debugTell(s) {
    debug.innerHTML = s;
}

function init3D() {
    clock = new THREE.Clock();
    
	renderer = new THREE.WebGLRenderer({  antialias: true });
	renderer.setSize( vsize.x, vsize.y );
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

	container = document.getElementById("viewport");
    container.appendChild( renderer.domElement );

	scene = new THREE.Scene();
    
	camera = new THREE.PerspectiveCamera( 45, vsize.z, 1, 2000 );
    center = new THREE.Vector3(0,40,0);
	centerLight =  new THREE.Vector3(0,-45,0);
	moveCamera();
    
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    
    var light = new THREE.SpotLight( 0xFFFFFF, 1, 0, Math.PI/2, 1 );
	light.castShadow = true;
	//light.onlyShadow = false;
	light.shadowCameraNear = 50;
	light.shadowCameraFar = 500;
	//light.shadowCameraFov = 35;
	light.shadowBias = -0.005;
	light.shadowMapWidth = light.shadowMapHeight = 1024;
	light.shadowDarkness = 0.35;
    light.position.copy(Orbit(centerLight, lightPos.horizontal, lightPos.vertical, lightPos.distance));
    light.lookAt(centerLight);
    scene.add( light );
    
    var back = new THREE.Mesh( new THREE.IcosahedronGeometry(300,1), new THREE.MeshBasicMaterial( { map:gradTexture([[0.75,0.5,0.45, 0.2], ['#808080','#2e3032','#09050e', '#86a4bc']]), side:THREE.BackSide, depthWrite: false }  ));
    back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(5*ToRad));
    scene.add( back );
    
    var groundMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true } );
	groundMaterial.blending = THREE[ "MultiplyBlending" ];
	var ground = new THREE.Mesh(new THREE.PlaneGeometry( 1000, 1000, 4, 4 ), groundMaterial);
	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );
    
    var helper = new THREE.GridHelper( 100, 50 );
	helper.setColors( 0x909090, 0x606060 );
	scene.add( helper );

	//importBody();

	window.addEventListener( 'resize', resize, false );
	container.addEventListener( 'mousemove', onMouseMove, false );
	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'mouseout', onMouseUp, false );
	container.addEventListener( 'mouseup', onMouseUp, false );

	var body = document.body;
	if( body.addEventListener ){
	    body.addEventListener( 'mousewheel', onMouseWheel, false ); //chrome
	    body.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	}else if( body.attachEvent ){
	    body.attachEvent("onmousewheel" , onMouseWheel); // ie
	}
    

	initBVH();
    loadSea3dBody()
}

function animate() {
    requestAnimationFrame( animate );
    updateBVH();
	render();
}

function render() {
	renderer.clear();
	renderer.render( scene, camera );
}

function resize( event ) {
	vsize.x = window.innerWidth;
	vsize.y = window.innerHeight;
	vsize.z = vsize.x / vsize.y;
	camera.aspect = vsize.z;
	camera.updateProjectionMatrix();
	renderer.setSize( vsize.x, vsize.y );
}

function Orbit(origine, horizontal, vertical, distance) {
    var p = new THREE.Vector3();
	var phi = vertical*ToRad;
	var theta = horizontal*ToRad;
	p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
	p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
	p.y = (distance * Math.cos(phi)) + origine.y;
	return p;
}

function moveCamera() {
    camera.position.copy(Orbit(center, camPos.horizontal, camPos.vertical, camPos.distance));
    camera.lookAt(center);
}

function onMouseDown(e) {
    e.preventDefault();
    mouse.ox = e.clientX;
    mouse.oy = e.clientY;
    mouse.h = camPos.horizontal;
    mouse.v = camPos.vertical;
    mouse.down = true;
}

function onMouseUp(e) {
    mouse.down = false;
    document.body.style.cursor = 'auto';
}

function onMouseMove(e) {
    e.preventDefault();
    if (mouse.down ) {
        document.body.style.cursor = 'move';
        camPos.horizontal = ((e.clientX - mouse.ox) * 0.3) + mouse.h;
        camPos.vertical = (-(e.clientY - mouse.oy) * 0.3) + mouse.v;
        moveCamera();
    } else {
    	mouse.ox = e.clientX;
	    mouse.oy = e.clientY;
    }
}

function onMouseWheel(e) {
    var delta = 0;
    if(e.wheelDelta){delta=e.wheelDelta*-1;}
    else if(e.detail){delta=e.detail*20;}
    camPos.distance+=(delta/10);

    moveCamera();   
    e.preventDefault();
}


function initBVH() {
    bvhReader = new BVH.Reader();
    loadBVH("ActionPak.BVH");
    //initBVHGui();
}

function loadBVH(file) {
    bvhReader.boneSize = BVHanimConfig.boneSize;
    bvhReader.speed = BVHanimConfig.speed;
    bvhReader.load(file);
}

function updateBVH() {
    //var delta = clock.getDelta();
    //THREE.SEA3D.AnimationHandler.update( delta*0.6 );
    //THREE.AnimationHandler.update( delta*0.6 );
    if(helperSquel!==null) helperSquel.update();
    if(bvhReader !== null) bvhReader.update();
    if(bones!==null) updateSkin();
}

//===============================================
// SEA3D
//===============================================

function loadSea3dBody(){
    var size = 1;
    var loader = new THREE.SEA3D();
    loader.onComplete = function( e ) {
        var model, model2;
        var i = loader.meshes.length, m;
        while(i--){
            if(loader.meshes[i].name == 'man') model = loader.meshes[i];
            if(loader.meshes[i].name == 'woman') model2 = loader.meshes[i];
            //if(loader.meshes[i].name == 'onkba') hero = loader.meshes[i];
        }
        hero = model;//.clone();
        //hero.animations = null;
        hero.scale.set(size, size, size);
        hero.material.skinning = true;
        hero.material.transparent = true;
        hero.material.opacity = 0.5;

        helperSquel = new THREE.SkeletonHelper(hero);

        //hero.play("walk", .5);
        //model2.play("walk", .5);
        //hero.material.normalScale={x:-2,y:-2};
        //hero.material.shininess = 14;
       
        
        // get model bones 
        hero.skeleton.calculateInverses();
        bones = hero.skeleton.bones;
        //reverseBone(bones);

        //console.log(bones)
        preservesBoneSize = false;
        
        scene.add(helperSquel);
        scene.add(hero);

        console.log(hero)
    }
    //loader.parser = THREE.SEA3D.DEFAULT;
    loader.load( bodyLink );
}

function reverseBone(bones){
    var i = bones.length, b;
    while(i--){
        b = bones[i];
        if(b.name=='LeftCollar') b.name = 'RightCollar';
        if(b.name=='RightCollar') b.name = 'LeftCollar';
        if(b.name=='LeftUpArm') b.name = 'RightUpArm';
        if(b.name=='RightUpArm') b.name = 'LeftUpArm';
        if(b.name=='LeftLowArm') b.name = 'RightLowArm';
        if(b.name=='RightLowArm') b.name = 'LeftLowArm';
        if(b.name=='LeftHand') b.name = 'RightHand';
        if(b.name=='RightHand') b.name = 'LeftHand';
    }

}

function heroVisibility() {
    if(hero.visible){hero.visible=false; document.getElementById("b3").value = "show model"}
    else{ hero.visible=true; document.getElementById("b3").value = "hide model";}
}

function skeletonVisibility() {
    if( bvhReader.skeleton.visible){ bvhReader.skeleton.visible=false; document.getElementById("b4").value = "show skeleton"}
    else{ bvhReader.skeleton.visible=true; document.getElementById("b4").value = "hide skeleton";}
}

function updateSkin(){
    var matrixWorldInv = new THREE.Matrix4().getInverse( hero.matrixWorld )
	var bone, node, name;
	var nodes = bvhReader.Nodes;
	var len = bones.length;
	var globalMtx, localMtx, parentMtx, tmpMtx, worldMtx;
	var globalQuat = new THREE.Quaternion();
    var globalPos = new THREE.Vector3();
    var tmpPos = new THREE.Vector3();

    for(var i=0; i<len; i++){
        bone = bones[i];
        name = bone.name;
        worldMtx = bone.parent.matrixWorld || matrixWorldInv;//new THREE.Matrix4();
        parentMtx = bone.parent.mtx ? bone.parent.mtx : worldMtx;
        if ( node = nodes[name] ){
			
			// LOCAL TO GLOBAL
			tmpMtx =  node.matrixWorld.clone();
            //tmpMtx.multiplyMatrices( matrixWorldInv,tmpMtx);
			globalPos.setFromMatrixPosition( tmpMtx );
            globalQuat.setFromRotationMatrix( tmpMtx );

			// PREPARES MATRIX
			globalMtx = new THREE.Matrix4();	
			if (!bone.rootMatrix) bone.rootMatrix = bone.matrixWorld.clone();	

            //bone.rootMatrix.multiplyMatrices( matrixWorldInv, bone.rootMatrix );	
			
			// MODIFY TRANSFORM
            globalMtx.makeRotationFromQuaternion( globalQuat );
			globalMtx.multiply( bone.rootMatrix );
            //globalMtx.multiply( new THREE.Matrix4().getInverse( bone.rootMatrix) );
			globalMtx.setPosition( globalPos );

			
			// GLOBAL TO LOCAL
			tmpMtx = new THREE.Matrix4().getInverse( worldMtx );
			localMtx = new THREE.Matrix4().multiplyMatrices( tmpMtx, globalMtx );
			globalMtx.multiplyMatrices( worldMtx, localMtx );

			// PRESERVES BONE SIZE
			if(preservesBoneSize && name!=='Hips'){
				tmpMtx = new THREE.Matrix4().getInverse( parentMtx );
                //tmpPos.setFromMatrixPosition( new THREE.Matrix4().getInverse(bone.matrix) );
				tmpPos.setFromMatrixPosition( bone.matrix );
    			localMtx = new THREE.Matrix4().multiplyMatrices( tmpMtx, globalMtx );
    			localMtx.setPosition( tmpPos );
                //localMtx.scale(new THREE.Vector3(1,1,-1))
    			globalMtx = new THREE.Matrix4().multiplyMatrices( parentMtx, localMtx );
                //globalMtx = localMtx;// new THREE.Matrix4().multiplyMatrices( parentMtx, localMtx );
			}
        } else {
        	globalMtx = new THREE.Matrix4().multiplyMatrices( parentMtx, bone.matrix );
		}

		// UPDATE BONE
		bone.mtx = globalMtx;
        //globalMtx = globalMtx.multiplyMatrices( matrixWorldInv );
       // bone.matrixAutoUpdate = true;
       // bone.matrixWorldNeedsUpdate = true;
    }
}




//===============================================
//   THREE BONE HACK 
//===============================================

THREE.Skeleton.prototype.update = ( function () {
	var offsetMatrix = new THREE.Matrix4();
	return function () {
		// flatten bone matrices to array
		var b =  this.bones.length;
		while(b--){
			// compute the offset between the current and the original transform
            if(!this.bones[ b ].mtx ) this.bones[ b ].mtx = this.bones[ b ].matrixWorld; 
			var matrix = this.bones[ b ] ? this.bones[ b ].mtx : this.identityMatrix;

            //var matrix = this.bones[ b ] ? this.bones[ b ].matrixWorld : this.identityMatrix;

			offsetMatrix.multiplyMatrices( matrix, this.boneInverses[ b ] );
            //offsetMatrix.multiplyMatrices( matrix, this.bones[ b ].matrixWorld );
			offsetMatrix.flattenToArrayOffset( this.boneMatrices, b * 16 );
		}
		if ( this.useVertexTexture ) this.boneTexture.needsUpdate = true;
	};
} )();


//===============================================
// BVH
//===============================================

var BVH = { REVISION:'1.0'};

BVH.TO_RAD = Math.PI / 180;
window.URL = window.URL || window.webkitURL;

BVH.Reader = function(){
	this.debug = true;
	this.type = "";
	this.data = null;
	this.rootBone = null;
	this.numFrames = 0;
	this.secsPerFrame = 0;
	this.play = false;
	this.channels = null;
	this.lines = "";
	
	this.speed = 1;

	this.nodes = null;
    this.order = {};
	
	this.frame = 0;
	this.oldFrame = 0;
	this.startTime = 0;
    
    this.ParentNodes = null;
	this.ChildNodes = null;
	this.BoneByName = null;
	this.Nodes = null;
	
	this.position = new THREE.Vector3( 0, 0, 0 );
	this.scale = 1;

	this.tmpOrder = "";
	this.tmpAngle = [];

	this.skeleton = null;
	this.bones = [];
    this.nodesMesh = [];
    
	this.boneSize = 0.4;
    this.nodeSize = 0.4;
    
    // geometry
	this.boxgeo = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry( 1.5, 1.5, 1 ) );
    this.boxgeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0.5 ) );
    this.nodegeo = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry ( this.nodeSize, 8, 6 ) );
    
    // material
    this.boneMaterial = new THREE.MeshBasicMaterial({ color:0xffff44 });
    this.nodeMaterial = new THREE.MeshBasicMaterial({ color:0x88ff88 });
}

BVH.Reader.prototype = {
    constructor: BVH.Reader,

    load:function(fname){
    	this.type = fname.substring(fname.length-3,fname.length);

    	var _this = this;
		var xhr = new XMLHttpRequest();
		xhr.open( 'GET', fname, true );

		if(this.type === 'bvh' || this.type === 'BVH'){ // direct from file
			xhr.onreadystatechange = function(){ if ( this.readyState == 4 ){ _this.parseData(this.responseText.split(/\s+/g));}};			
	    } else if(this.type === 'png'){ // from png compress
	    	xhr.responseType = 'blob';
	    	xhr.onload = function(e) {
	    		if (this.readyState == 4 ) {//if (this.status == 200) {
		    		var blob = this.response;
		    		var img = document.createElement('img');
		    		img.onload = function(e) {
		    			var c=document.createElement("canvas"), r='', pix, i, string = "";
		    			c.width = this.width;
		    			c.height = this.height;
		    			c.getContext('2d').drawImage(this, 0, 0);
		    			var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
		    			for ( i = 0, l=d.length; i<l; i+=4){
							pix = d[i];
							if( pix<96 ) string += String.fromCharCode(pix+32);
						}
						var array = string.split(",");
						_this.parseData(array);
		    		    window.URL.revokeObjectURL(img.src); // Clean up after yourself.
		    		}
		    		img.src = window.URL.createObjectURL(blob);
		    	}
	    	}
	    }
	    xhr.send( null );
    },
    parseData:function(data){
    	this.data = data;
		this.channels = [];
		this.nodes = [];
        this.Nodes = {};
        this.distances = {};
        
		this.ParentNodes = {};
		this.ChildNodes = {};
		this.BoneByName = {};
        
		var done = false;
		while (!done) {
			switch (this.data.shift()) {
			case 'ROOT':
			    if(this.rootBone !== null) this.clearNode();
                if(this.skeleton !== null) this.clearSkeleton();

				this.rootBone = this.parseNode(this.data);
				this.rootBone.position.copy(this.position);
				this.rootBone.scale.set(this.scale,this.scale,this.scale);

				break;
			case 'MOTION':
				this.data.shift();
				this.numFrames = parseInt( this.data.shift() );
				this.data.shift();
				this.data.shift();
				this.secsPerFrame = parseFloat(this.data.shift());
				done = true;
			}
		}

		debugTell("BVH frame:"+this.numFrames+" s/f:"+this.secsPerFrame + " channels:"+this.channels.length + " node:"+ this.nodes.length);
        this.getDistanceList();
		this.getNodeList();
        
        if(this.debug) this.addSkeleton();
        
		this.startTime = Date.now();
		this.play = true;
    },
    reScale:function (s) {
    	this.scale = s;
    	this.rootBone.scale.set(this.scale,this.scale,this.scale);
    },
    rePosition:function (v) {
    	this.position = v;
    	this.rootBone.position.copy(this.position);
    },
    getDistanceList:function () {
    	this.distances = {};
    	var n = this.nodes.length, node, name;
    	while (n--){
    		node = this.nodes[n];
    		name = node.name;
    		if(node.children.length){
    			this.distances[name] = this.distanceTest(new THREE.Vector3().setFromMatrixPosition( node.matrixWorld ), node.children[0].position);
    		} else this.distances[name] = 2;
    	}
    },
    distanceTest:function(p1, p2){
        var x = p2.x-p1.x;
        var y = p2.y-p1.y;
        var z = p2.z-p1.z;
        var d = Math.sqrt(x*x + y*y + z*z);
        if(d<=0)d=0.1;
        return d;
    },  
    getNodeList:function () {
    	var n = this.nodes.length, node, s = "", name, p1,p2;
    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
    		name = node.name;

    		this.Nodes[name] = node;
    		if(node.parent){ 
    			this.ParentNodes[name] = node.parent; 
    		} else this.ParentNodes[name] = null;
		    if(node.children.length){
		    	this.ChildNodes[name] = node.children[0]; 
		    } else{
		        this.ChildNodes[name] = null;
		    }
            
    		s += node.name + " _ "+ i +"<br>"//+" _ "+node.parent.name +" _ "+node.children[0].name+"<br>";
    	}
    	if(out2)out2.innerHTML = s;
    },
    addSkeleton:function (){
    	this.skeleton = new THREE.Group();
    	this.bones = [];
        this.nodesMesh = [];

    	var n = this.nodes.length, node, bone;

    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
            this.nodesMesh[i] = new THREE.Mesh( this.nodegeo, this.nodeMaterial )
    		this.skeleton.add(this.nodesMesh[i]);
            
    		if ( node.name !== 'Site' ){
    			bone = new THREE.Mesh(this.boxgeo, this.boneMaterial);
    			bone.castShadow = true;
                bone.receiveShadow = true;
    			bone.rotation.order = 'XYZ';
	    		bone.name = node.name;
	    		this.skeleton.add(bone);
	    		this.bones[i] = bone;
                this.BoneByName[node.name] = bone;
    	    }
    	}
    	scene.add( this.skeleton );
        this.skeleton.visible = false;

    },
    clearSkeleton:function () {
    	var n = this.skeleton.children.length;
    	while(n--){
    		this.skeleton.remove(this.skeleton.children[n]);
    	}
    	scene.remove( this.skeleton );
    	this.skeleton = null;
    },
    updateSkeleton:function (  ) {
    	var mtx, node, bone, name;
    	var n = this.nodes.length;
    	var target;
    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
    		bone = this.bones[i];
            name = node.name;
            
            mtx = node.matrixWorld;
            this.nodesMesh[i].position.setFromMatrixPosition( mtx );

    		if ( name !== 'Site' ){
	    		
	    		bone.position.setFromMatrixPosition( mtx );
	    		if(node.children.length){
	    			target = new THREE.Vector3().setFromMatrixPosition( node.children[0].matrixWorld );
	    			bone.lookAt(target);
	    			bone.rotation.z = 0;

	    			if(name==="Head")bone.scale.set(this.boneSize*2,this.boneSize*2,this.distances[name]*(this.boneSize*1.5));
	    			else bone.scale.set(this.boneSize,this.boneSize,this.distances[name]);
	    		}
	    	}
    	}
    },
	transposeName:function(name){
		if(name==="hip" || name==="SpineBase") name = "Hips";
		if(name==="abdomen" || name==="SpineBase2") name = "Spine1";
		if(name==="chest" || name==="SpineMid") name = "Chest";
		if(name==="neck" || name==="Neck2") name = "Neck";
		if(name==="head") name = "Head";
		if(name==="lCollar") name = "LeftCollar";
		if(name==="rCollar") name = "RightCollar";
		if(name==="lShldr") name = "LeftUpArm";
		if(name==="rShldr") name = "RightUpArm";
		if(name==="lForeArm") name = "LeftLowArm";
		if(name==="rForeArm") name = "RightLowArm";
		if(name==="lHand") name = "LeftHand";
		if(name==="rHand") name = "RightHand";
		if(name==="lFoot") name = "LeftFoot";
		if(name==="rFoot") name = "RightFoot";
		if(name==="lThigh") name = "LeftUpLeg";
		if(name==="rThigh") name = "RightUpLeg";
		if(name==="lShin") name = "LeftLowLeg";
		if(name==="rShin") name = "RightLowLeg";

		// leg
		if(name==="RightHip" || name==="HipRight") name = "RightUpLeg";
		if(name==="LeftHip" || name==="HipLeft") name = "LeftUpLeg";
		if(name==="RightKnee" || name==="KneeRight") name = "RightLowLeg";
		if(name==="LeftKnee" || name==="KneeLeft") name = "LeftLowLeg";
		if(name==="RightAnkle" || name==="AnkleRight") name = "RightFoot";
		if(name==="LeftAnkle" || name==="AnkleLeft") name = "LeftFoot";
		// arm
		if(name==="RightShoulder" || name==="ShoulderRight") name = "RightUpArm";
		if(name==="LeftShoulder" || name==="ShoulderLeft") name = "LeftUpArm";
		if(name==="RightElbow" || name==="ElbowRight") name = "RightLowArm";
		if(name==="LeftElbow" || name==="ElBowLeft") name = "LeftLowArm";
		if(name==="RightWrist" || name==="WristRight") name = "RightHand";
		if(name==="LeftWrist"|| name==="WristLeft") name = "LeftHand";

		if(name==="rcollar" || name==="CollarRight") name = "RightCollar";
		if(name==="lcollar" || name==="CollarLeft") name = "LeftCollar";

		if(name==="rtoes") name = "RightToe";
		if(name==="ltoes") name = "LeftToe";

		if(name==="upperback") name = "Spine1";
		
		return name;
	},
    parseNode:function(data){
    	var name, done, n, node, t;
		name = data.shift();
		name = this.transposeName(name);
		node = new THREE.Group();
		node.name = name;

		done = false;
		while ( !done ) {
			switch ( t = data.shift()) {
				case 'OFFSET':
					node.position.set( parseFloat( data.shift() ), parseFloat( data.shift() ), parseFloat( data.shift() ) );
					node.offset = node.position.clone();
					break;
				case 'CHANNELS':
					n = parseInt( data.shift() );
					for ( var i = 0;  0 <= n ? i < n : i > n;  0 <= n ? i++ : i-- ) { 
						this.channels.push({ node: node, prop: data.shift() });
					}
					break;
				case 'JOINT':
				case 'End':
					node.add( this.parseNode(data) );
					break;
				case '}':
					done = true;
			}
		}
		this.nodes.push(node);
		return node;
    },
    clearNode:function(){
    	var i;
    	if(out2)out2.innerHTML = "";

    	if(this.nodes){
	    	for (i=0; i<this.nodes.length; i++){
				this.nodes[i] = null;
			}
			this.nodes.length = 0;

			/*if(this.bones.length > 0){
		    	for ( i=0; i<this.bones.length; i++){
					if(this.bones[i]){
						this.bones[i].geometry.dispose();
					}
				}
				this.bones.length = 0;
		        scene.remove( this.skeleton );
		   }*/
		}
    },
    animate:function(){
    	//debugTell("frame" +  this.frame);
    	var ch;
		var n =  this.frame % this.numFrames * this.channels.length;
		var ref = this.channels;
		var isRoot = false;

		for ( var i = 0, len = ref.length; i < len; i++) {
			ch = ref[ i ];
			if(ch.node.name === "Hips") isRoot = true;
			else isRoot = false;


			switch ( ch.prop ) {
				case 'Xrotation':
				    this.autoDetectRotation(ch.node, "X", parseFloat(this.data[n]));
					//ch.node.rotation.x = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Yrotation':
				    this.autoDetectRotation(ch.node, "Y", parseFloat(this.data[n]));
					//ch.node.rotation.y = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Zrotation':
				    this.autoDetectRotation(ch.node, "Z", parseFloat(this.data[n]));
					//ch.node.rotation.z = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Xposition':
				    if(isRoot) ch.node.position.x = ch.node.offset.x + parseFloat(this.data[n])+ this.position.x;
					else ch.node.position.x = ch.node.offset.x + parseFloat(this.data[n]);
					break;
				case 'Yposition':
				    if(isRoot) ch.node.position.y = ch.node.offset.y + parseFloat(this.data[n])+ this.position.y;
					else ch.node.position.y = ch.node.offset.y + parseFloat(this.data[n]);
					break;
				case 'Zposition':
				    if(isRoot) ch.node.position.z = ch.node.offset.z + parseFloat(this.data[n])+ this.position.z;
					else ch.node.position.z = ch.node.offset.z + parseFloat(this.data[n]);
				break;
			}

			n++;
		}

		if(this.bones.length > 0) this.updateSkeleton();
		
    },
    autoDetectRotation:function(Obj, Axe, Angle){

    	this.tmpOrder+=Axe;
    	var angle = Angle * BVH.TO_RAD;

    	if(Axe === "X")this.tmpAngle[0] = angle;
    	else if(Axe === "Y")this.tmpAngle[1] = angle;
    	else this.tmpAngle[2] = angle;

    	if(this.tmpOrder.length===3){
    		var e = new THREE.Euler( this.tmpAngle[0], this.tmpAngle[1], this.tmpAngle[2], this.tmpOrder );
            this.order[Obj.name] =  this.tmpOrder;
            
    		Obj.setRotationFromEuler(e);
    		Obj.updateMatrixWorld();

    		this.tmpOrder = "";
    		this.tmpAngle.length = 0;
    	}

    },
    update:function(){
    	if ( this.play ) { 
			this.frame = ((((Date.now() - this.startTime) / this.secsPerFrame / 1000) )*this.speed)| 0;
			if(this.oldFrame!==0)this.frame += this.oldFrame;
			if(this.frame > this.numFrames ){this.frame = 0;this.oldFrame=0; this.startTime =Date.now() }

			this.animate();
		}
    },
    next:function(){
    	this.play = false;
    	this.frame ++;
    	if(this.frame > this.numFrames )this.frame = 0;
    	this.animate();
    },
    prev:function(){
    	this.play = false;
    	this.frame --;
    	if(this.frame<0)this.frame = this.numFrames;
    	this.animate();
    }

}


//===============================================
//  AUTO TEXTURE
//===============================================

function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    c.width = 16; c.height = 256;
    var gradient = ct.createLinearGradient(0,0,0,256);
    var i = color[0].length;
    while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
    ct.fillStyle = gradient;
    ct.fillRect(0,0,16,256);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}