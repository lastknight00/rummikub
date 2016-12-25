var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var os = require('os');
var ifaces = os.networkInterfaces();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log(req.connection);
  //res.send("This is detault page");
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  //res.send('Your IP is ' + ip);
  res.sendFile(__dirname + '/home.html');
});

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log('http://' + iface.address + ':8080');
    }
    ++alias;
  });
});

app.listen(8080);
