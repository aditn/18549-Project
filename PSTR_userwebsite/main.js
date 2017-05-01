// Just a simple way to check if jquery is loaded
if ($ == undefined) {
    console.log('jquery load failed');
}

/*
 * API
 *
 */
const get_data_url = "http://pstr-env.us-east-2.elasticbeanstalk.com/data?number=1";

// curl -H "Content-Type: application/json" -X POST -d '{'sensor1':100,'sensor2':100,'sensor3':100,'sensor4':100,'text':'test'}' http://pstr-env.us-east-2.elasticbeanstalk.com:80

/*
 * @param none
 * @return a jquery deffered object
 */
function getSensorData() {
    let r = {
        type: 'GET',
        url: get_data_url
    };
    $.ajax(r).then(function(data) {
        sensor_data = data;
    });
    return;
}

/*
 * Drawing
 *
 */
const chair = document.getElementById('chair');
let WIDTH = chair.clientWidth;
let HEIGHT = chair.clientHeight;
let renderer,
    scene,
    camera,
    controls,
    bar;
let sensor_data = [];
let sensor_points = [];

function init() {
    getSensorData();
    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, .1, 1000);
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x111111, 150, 200);

    //create the chair using line segments
    let geometryChair = chair_model(50);
    var object = new THREE.LineSegments(geometryChair, new THREE.LineDashedMaterial({color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2}));

    scene.add(object);

    // set up renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x111111);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    // set up control
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // add the actual elements
    chair.appendChild(renderer.domElement);
    bar = new ProgressBar.Line('#progressbar',{
        strokeWidth: 4,
        easing: 'easeInOut',
        trailColor: '#eee',
        color: '#1cff00'
    });
    bar.animate(0.8);
    // routine
    window.addEventListener('resize', onWindowResize, false);
    return;
}
function create_bar() {
    bar = new ProgressBar.Line('#progressbar',
    {
        easing: 'easeInOut',
    });
    return;
}
function chair_model(size) {
    let h = size * 0.5;
    let geometry = new THREE.Geometry();
    sensor_points.push(new THREE.Vector3(0, 0, 0));
    sensor_points.push(new THREE.Vector3(0, 0, -h));
    sensor_points.push(new THREE.Vector3(h, 0, 0));
    sensor_points.push(new THREE.Vector3(h, 0, -h));
    geometry.vertices.push(
    // bkleft
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0),
    // bktop
    new THREE.Vector3(0, h, 0), new THREE.Vector3(0, h, -h),
    // bkright
    new THREE.Vector3(0, h, -h), new THREE.Vector3(0, 0, -h),
    // bkbottom
    new THREE.Vector3(0, 0, -h), new THREE.Vector3(0, 0, 0),
    // seatleft
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -h, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(h, 0, 0), new THREE.Vector3(h, 0, 0), new THREE.Vector3(h, -h, 0), new THREE.Vector3(h, 0, 0), new THREE.Vector3(h, 0, -h), new THREE.Vector3(h, 0, -h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(h, 0, -h), new THREE.Vector3(0, 0, -h),
    //
    new THREE.Vector3(0, 0, -h), new THREE.Vector3(0, -h, -h));
    return geometry;
}

function onWindowResize() {
    WIDTH = chair.clientWidth;
    HEIGHT = chair.clientHeight;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
}

/*
 * Entry
 */
function animate() {
    requestAnimationFrame(animate);
    getSensorData();
    controls.update();
    render();
}
function create_point(index, data) {
    // console.log(data);
    if (data == null) {
        return;
    }
    let geometry = new THREE.SphereGeometry(1);
    let material;
    if (data <= 25) {
        material = new THREE.MeshBasicMaterial({color: 0xffffff});
    } else if (data <= 50) {
        material = new THREE.MeshBasicMaterial({color: 0x6bf731});
    } else {
        material = new THREE.MeshBasicMaterial({color: 0xbe4545});
    }
    let sphereInter = new THREE.Mesh(geometry, material);
    sphereInter.position.copy(sensor_points[index]);
    scene.add(sphereInter);
}

function render() {
    let len = sensor_data.length;
    if (len >= 1) {
        let latest_data = sensor_data[len - 1];
        create_point(0, latest_data.sensor1);
        create_point(1, latest_data.sensor2);
        create_point(2, latest_data.sensor3);
        create_point(3, latest_data.sensor4);
    }

    renderer.render(scene, camera);
}

init();
animate();
