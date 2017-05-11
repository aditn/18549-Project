// Just a simple way to check if jquery is loaded
if ($ == undefined) {
    console.log('jquery load failed');
}

/*
 * API
 *
 */
const get_data_url = "http://pstr-env.us-east-2.elasticbeanstalk.com/data2?number=1";

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
    count,
    last_score;
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

    last_score = sensor_data.score;
    create_bar();
    // routine
    window.addEventListener('resize', onWindowResize, false);
    return;
}
function create_bar(){
    let bar = new ProgressBar.Line('#progressbar',{
        strokeWidth: 4,
        easing: 'easeInOut',
        trailColor: '#ff0000',
        color: '#00ff00'
    });
    bar.set(last_score);
}
function chair_model(size) {
    let h = size * 0.5;
    let geometry = new THREE.Geometry();
    sensor_points.push(new THREE.Vector3(0, 0, 0)); //sb_l_weight
    sensor_points.push(new THREE.Vector3(0, 0, -h)); //sb_r_weight
    sensor_points.push(new THREE.Vector3(h, 0, 0)); //sf_l_weight
    sensor_points.push(new THREE.Vector3(h, 0, -h)); //sf_r_weight
    sensor_points.push(new THREE.Vector3(0, 0, -h/2 )); //st
    sensor_points.push(new THREE.Vector3(0, h/3,-h/2)); //bl
    sensor_points.push(new THREE.Vector3(0, 2*h/3, -h/2));//bu
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
    count++;
    // if(count >= 10){
    //     getSensorData();
    //     count = 0;
    // }
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
    if (index <= 3){
        data = data*100;
    }
    if (data <= 5) {
        material = new THREE.MeshBasicMaterial({color: 0xffffff});
    } else if (data <= 10) {
        material = new THREE.MeshBasicMaterial({color: 0xa3ffe3});
    } else if (data <= 20) {
        material = new THREE.MeshBasicMaterial({color: 0xd6f963});
    } else if (data <= 30) {
        material = new THREE.MeshBasicMaterial({color: 0x6aff45});
    } else if (data <= 40) {
        material = new THREE.MeshBasicMaterial({color: 0xf9a176});
    } else if (data <= 50) {
        material = new THREE.MeshBasicMaterial({color: 0xffb000});
    } else if (data <= 60) {
        material = new THREE.MeshBasicMaterial({color: 0xff8181});
    }else {
        material = new THREE.MeshBasicMaterial({color: 0xff0000});
    }
    let sphereInter = new THREE.Mesh(geometry, material);
    sphereInter.position.copy(sensor_points[index]);
    scene.add(sphereInter);
}

function render() {
    let len = sensor_data.length;
    if (len >= 1) {
        let latest_data = sensor_data[len - 1];
        create_point(0, latest_data.sb_l_perc);
        create_point(1, latest_data.sb_r_perc);
        create_point(2, latest_data.sf_l_perc);
        create_point(3, latest_data.sf_r_perc);
        create_point(4, latest_data.st);
        create_point(5, latest_data.bl);
        create_point(6, latest_data.bu);
        if(latest_data.score != last_score){
            last_score = latest_data.score;
            $('svg').remove();
            create_bar();
        }
    }
    renderer.render(scene, camera);
}

init();
animate();
