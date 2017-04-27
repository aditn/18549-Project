// Just a simple way to check if jquery is loaded
if ($ == undefined){
    console.log('jquery load failed');
}
// The time interval between each request
const timer_interval = 5000;
/*
 * API
 *
 */
const get_data_url = "http://ip.jsontest.com/";
/*
 * @param none
 * @return a jquery deffered object
 */
function getSensorData(){
    let r = {
        type: 'GET',
        url: get_data_url
    };
    return $.ajax(r);
}

/*
 * Drawing
 *
 */
const chair = document.getElementById('chair');
let WIDTH = chair.clientWidth;
let HEIGHT = chair.clientHeight;
let renderer, scene, camera, controls;
let sensor_data = [];
let sensor_points = [];
let objects = [];

function init(){
    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, .1, 1000);
	camera.position.z = 150;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x111111, 150, 200 );

    //create the chair using line segments
    let geometryChair = chair_model(50);
    var object = new THREE.LineSegments( geometryChair, new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ) );

    objects.push(object);
    scene.add(object);

    // set up renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0x111111 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
    // set up control
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // add the actual elements
	chair.appendChild( renderer.domElement );

    // routine
    window.addEventListener( 'resize', onWindowResize, false );
    return;
}

function chair_model( size ){
    let h = size * 0.5;
    let geometry = new THREE.Geometry();
    sensor_points.push((0,0,0));
    sensor_points.push((0,h/2,-h/2));
    sensor_points.push((0,0,-h/2));
    sensor_points.push((0,0,-h));
    sensor_points.push((h,0,0));
    sensor_points.push((h,0,-h));
    geometry.vertices.push(
        // bkleft
        new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, h, 0 ),
        // bktop
		new THREE.Vector3( 0, h, 0 ),
		new THREE.Vector3( 0, h, -h ),
        // bkright
        new THREE.Vector3( 0, h, -h ),
		new THREE.Vector3( 0, 0, -h ),
        // bkbottom
        new THREE.Vector3( 0, 0, -h ),
        new THREE.Vector3( 0, 0, 0 ),
        // seatleft
		new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( 0, -h, 0 ),

		new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( h, 0, 0 ),

		new THREE.Vector3( h, 0, 0 ),
        new THREE.Vector3( h, -h, 0),

		new THREE.Vector3( h, 0, 0 ),
		new THREE.Vector3( h, 0, -h ),

    	new THREE.Vector3( h, 0, -h ),
        new THREE.Vector3( h, -h, -h ),

		new THREE.Vector3( h, 0, -h ),
        new THREE.Vector3( 0, 0, -h),
        //
        new THREE.Vector3( 0, 0, -h ),
		new THREE.Vector3( 0, -h, -h )
    );
    return geometry;
}
function cube( size ) {
	var h = size * 0.5;
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( -h, -h, -h ),
		new THREE.Vector3( -h, h, -h ),
		new THREE.Vector3( -h, h, -h ),
		new THREE.Vector3( h, h, -h ),
		new THREE.Vector3( h, h, -h ),
		new THREE.Vector3( h, -h, -h ),
		new THREE.Vector3( h, -h, -h ),
		new THREE.Vector3( -h, -h, -h ),
		new THREE.Vector3( -h, -h, h ),
		new THREE.Vector3( -h, h, h ),
		new THREE.Vector3( -h, h, h ),
		new THREE.Vector3( h, h, h ),
		new THREE.Vector3( h, h, h ),
		new THREE.Vector3( h, -h, h ),
		new THREE.Vector3( h, -h, h ),
		new THREE.Vector3( -h, -h, h ),
		new THREE.Vector3( -h, -h, -h ),
		new THREE.Vector3( -h, -h, h ),
		new THREE.Vector3( -h, h, -h ),
		new THREE.Vector3( -h, h, h ),
		new THREE.Vector3( h, h, -h ),
		new THREE.Vector3( h, h, h ),
		new THREE.Vector3( h, -h, -h ),
		new THREE.Vector3( h, -h, h )
	 );
	return geometry;
}
function onWindowResize() {
    WIDTH = chair.clientWidth;
    HEIGHT = chair.clientHeight;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize( WIDTH, HEIGHT );
}

/*
 * Entry
 */
function animate(){
    requestAnimationFrame( animate );
    controls.update();
	render();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const d_min = 0;
const d_max = 100;
let count = 0;
function render(){
    // get new sensor data here
    // 6 random data
    if( count <= 333){
        count ++;
        renderer.render(scene, camera);
        return;
    }
    count = 0;
    sensor_data.push(getRandomInt(d_min,d_max));
    sensor_data.push(getRandomInt(d_min,d_max));
    sensor_data.push(getRandomInt(d_min,d_max));
    sensor_data.push(getRandomInt(d_min,d_max));
    sensor_data.push(getRandomInt(d_min,d_max));
    sensor_data.push(getRandomInt(d_min,d_max));
    let geometry = new THREE.SphereGeometry(1);
    let material;
    for (let i = 0; i < sensor_data.length;i ++){
        if(sensor_data[i] <= 33){
            material = new THREE.MeshBasicMaterial( { color: 0xbe4545 } );
        }else if (sensor_data[i] <= 66){
            material = new THREE.MeshBasicMaterial( { color: 0x3e9cd7 } );
        }else{
            material = new THREE.MeshBasicMaterial( { color: 0x6bf731 } );
        }
        sphereInter = new THREE.Mesh( geometry, material );
		sphereInter.visible = true;
        sphereInter.position.copy(new THREE.Vector3(sensor_points[i]));
		scene.add( sphereInter );
    }
    renderer.render(scene, camera);
}

init();
animate();
