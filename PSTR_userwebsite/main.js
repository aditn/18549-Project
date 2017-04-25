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
function drawChair(){
    console.log('drawing chair');

    return;
}

function updateChair(data){
    $('#chair').html(data);
    return;
}

/*
 * Entry
 */
function update(){
    getSensorData().then(function(data){
        console.log(data);


    });
    return;
}
// Draw chair first
drawChair();
// Then update
update();
