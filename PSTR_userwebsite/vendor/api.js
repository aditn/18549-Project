const get_data_url = "http://a47f08cb.ngrok.io";
const timer_interval = 5000;
// use jquery ajax to get sensor data
function getSensorData(){
    let r = {
        type: 'GET',
        url: get_data_url,
    };
    return $.ajax(r);
}
