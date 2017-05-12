const get_data_url = "http://pstr-env.us-east-2.elasticbeanstalk.com/data2";

function getSensorData() {
    let r = {
        type: 'GET',
        url: get_data_url
    };
    $.ajax(r).then(function(data) {
        sensor_data = data;
        render();
    });
    return;
}
let sensor_data = [];

function render(){
    for (let i = 0; i < sensor_data.length; i++){
        let data = sensor_data[i];
        let row = '<tr>';
        row += '<td/>'+data.user+'</td>';
        row += '<td/>'+data.timestamp+'</td>';
        row += '<td/>'+data.sb_l_weight+'</td>';
        row += '<td/>'+data.sb_r_weight+'</td>';
        row += '<td/>'+data.sf_l_weight+'</td>';
        row += '<td/>'+data.sf_r_weight+'</td>';
        row += '<td/>'+data.st+'</td>';
        row += '<td/>'+data.bl+'</td>';
        row += '<td/>'+data.bu+'</td>';
        row += '<td/>'+data.score+'</td>';
        row+='</tr>';
        console.log(row);
        $('#infotable > tbody:first').append(row);
    }
}

getSensorData();
