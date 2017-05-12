// Just a simple way to check if jquery is loaded
if ($ == undefined) {
    console.log('jquery load failed');
}

/*
 * API
 *
 */
let get_data_url = "http://pstr-env.us-east-2.elasticbeanstalk.com/data2?number=1";

/*
 * @param none
 * @return a jquery deffered object
 */
function getSensorData() {
    let r = {
        type: 'GET',
        url: get_data_url
    };
    $.ajax(r).done(function(data){
        sensor_data = data;
        getSensorData();
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
let sensor_points_objects = [];

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}

function init() {
    let vars = getUrlVars();
    if (vars.user == undefined || vars.user == ''){
        window.location.replace('index.html');
    }else{
        get_data_url += "&user=";
        get_data_url += vars.user;
        $('.header').html("Welcome to PSTR, "+vars.user);
    }
    getSensorData();
    // setInterval(getSensorData,500);
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
    let f = 2/11;
    let geometry = new THREE.Geometry();
    sensor_points.push(new THREE.Vector3(h*f, 0, -h*f)); //sb_l_weight
    sensor_points.push(new THREE.Vector3(h*f, 0, -h*(1-f))); //sb_r_weight
    sensor_points.push(new THREE.Vector3(h*(1-f), 0, -h*f)); //sf_l_weight
    sensor_points.push(new THREE.Vector3(h*(1-f), 0, -h*(1-f))); //sf_r_weight
    sensor_points.push(new THREE.Vector3(0, h * (1-f),-h/2)); //bu
    sensor_points.push(new THREE.Vector3(0, h * 2 * f, -h/2));//bl
    geometry.vertices.push(
    // chair vertices
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0),
    new THREE.Vector3(0, h, 0), new THREE.Vector3(0, h, -h),
    new THREE.Vector3(0, h, -h), new THREE.Vector3(0, 0, -h),
    new THREE.Vector3(0, 0, -h), new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -h, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(h, 0, 0),
    new THREE.Vector3(h, 0, 0), new THREE.Vector3(h, -h, 0),
    new THREE.Vector3(h, 0, 0), new THREE.Vector3(h, 0, -h),
    new THREE.Vector3(h, 0, -h), new THREE.Vector3(h, -h, -h),
    new THREE.Vector3(h, 0, -h), new THREE.Vector3(0, 0, -h),
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
    controls.update();
    render();
}
function create_point(index, data) {
    // console.log(data);
    if (data == null) {
        return;
    }
    let geometry = new THREE.SphereGeometry(1);
    let material = getMaterialByData(data);
    let sphereInter = new THREE.Mesh(geometry, material);
    sphereInter.position.copy(sensor_points[index]);
    return sphereInter;
    // scene.add(sphereInter);
}
function getMaterialByData(data){
    let material;
    data = data * 100;
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
    return material;
}

function render() {
    let len = sensor_data.length;
    if (len >= 1) {
        let latest_data = sensor_data[len - 1];
        if (sensor_points_objects.length < 5){
            sensor_points_objects = [];
            sensor_points_objects.push(create_point(0, latest_data.sb_l_perc));
            sensor_points_objects.push(create_point(1, latest_data.sb_r_perc));
            sensor_points_objects.push(create_point(2, latest_data.sf_l_perc));
            sensor_points_objects.push(create_point(3, latest_data.sf_r_perc));
            // create_point(4, latest_data.st);
            sensor_points_objects.push(create_point(4, latest_data.bu));
            sensor_points_objects.push(create_point(5, latest_data.bl));
            for (obj in sensor_points_objects){
                scene.add(sensor_points_objects[obj]);
            }
        }else{
            // Has all objects, update data
            sensor_points_objects[0].material.copy(getMaterialByData(latest_data.sb_l_perc));
            sensor_points_objects[1].material.copy(getMaterialByData(latest_data.sb_r_perc));
            sensor_points_objects[2].material.copy(getMaterialByData(latest_data.sf_l_perc));
            sensor_points_objects[3].material.copy(getMaterialByData(latest_data.sf_r_perc));
            sensor_points_objects[4].material.copy(getMaterialByData(latest_data.bu));
            sensor_points_objects[5].material.copy(getMaterialByData(latest_data.bl));
        }
        if(latest_data.score != last_score){
            last_score = latest_data.score;
            // $('#score').html("score : "+ last_score);
            $('svg').remove();
            create_bar();
        }
        if(latest_data.seated){
            $('#message').html( latest_data.status_msg || 'calculating...');
        }else{
            $('#message').html( 'Not seated');
        }
    }
    renderer.render(scene, camera);
}

init();
animate();
