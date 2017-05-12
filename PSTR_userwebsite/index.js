const setUserUrl = "http://pstr-env.us-east-2.elasticbeanstalk.com/user";

function login(username){
    $('#loginForm').addClass('loading');
    $.ajax({
        type: 'post',
        url : setUserUrl,
        dataType : 'json',
        crossDomain : true,
        contentType : 'application/json; charset=utf-8',
        processData : false,
        data: JSON.stringify({'user' : username})
    }).always(function(res){
        let newUrl = 'views/home/home.html?user=' + username;
        window.location.replace(newUrl);
    });
}

function loginAsTest(){
    login('test');
}

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

function onLoad(){
    let vars = getUrlVars();
    if(vars.username != undefined && vars.username != ''){
        login(vars.username);
    }
    $('#loginForm').form({
        fields:{
            username: {
                identifier: 'username',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter a username'
                },{
                    type   : 'notExactly[test]',
                    prompt : 'This username is reserved'
                }
                ]
            }
        }
    });
}

onLoad();
