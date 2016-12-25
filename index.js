var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var os = require('os');
var ifaces = os.networkInterfaces();
var serverIp = '';
var userList = [];
var gameInfo = {};
const GAME_STATE_WATING = 1;
const GAME_STATE_STARTING = 2;
var gameState = GAME_STATE_WATING;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

app.get('/game', function(req,res) {
  console.log(req.query.userName)
  res.sendFile(__dirname + '/html/game.html');
});

app.post('/enterUser', function(req, res) {
  var userName = req.body.userName;

  var result = {};
  if(userList[userName]) {
    result.resultCode = '02';
    result.message = '이미 사용중인 이름입니다.';
  } else {
    userList[userName] = {userName : userName, ip : '127.0.0.1'};
    result.resultCode = '01';
    if(gameState == GAME_STATE_WATING) {
      result.url = '/game';
    } else {
      result.url = '/';
    }
    result.userName = userName;
  }
  res.send(result);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/main.html');
});

var getIp = function(req) {
  return req.header('x-forwarded-for')|| req.connection.remoteAddress;
};

var isServer = function(req) {
  var ip = getIp(req);
  if(ip.includes(serverIp) || ip.includes('127.0.0.1')) {
    return true;
  } else {
    return false;
  }
};


Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }
    if (alias >= 1) {
      console.log(ifname + ':' + alias, iface.address);
    } else {
      serverIp = iface.address;
      console.log('http://' + serverIp + ':8080');
    }
    ++alias;
  });
});

app.listen(8080);
