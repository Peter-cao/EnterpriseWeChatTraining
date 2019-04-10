

const {ReceiveReverseProxy, SendReverseProxy} = require('./mail');

// new ReceiveReverseProxy({
//     local: {
//         port: 11024
//     },
//     target: {
//         port: 993,
//         host: 'partner.outlook.cn'
//     }
// });

// new SendReverseProxy({
//     local: {
//         port: 11025
//     },
//     target: {
//         port: 25,
//         host: 'partner.outlook.cn'
//     }
// });

new ReceiveReverseProxy({
    local: {
        port: 11024
    },
    target: {
        port: 993,
        host: 'imap.126.com'
    }
});

new SendReverseProxy({
    local: {
        port: 11025
    },
    target: {
        port: 465,
        host: 'smtp.126.com'
    }
});

// new ReceiveReverseProxy({
//     local: {
//         port: 11024
//     },
//     target: {
//         port: 993,
//         host: 'imap.exmail.qq.com'
//     }
// });

// new SendReverseProxy({
//     local: {
//         port: 11025
//     },
//     target: {
//         port: 465,
//         host: 'smtp.exmail.qq.com'
//     }
// });



// new ReceiveReverseProxy({
//     local: {
//         port: 11026
//     },
//     target: {
//         port: 995,
//         host: 'pop.gmail.com'
//     }
// });

// new SendReverseProxy({
//     local: {
//         port: 11027
//     },
//     target: {
//         port: 465,
//         host: 'smtp.gmail.com'
//     }
// });


// const net = require('net');
// var Parser = require('imap-parser');


// const tcpProxyServer = net.createServer(function (clientSocket) {
//     var parser = new Parser();

//     parser.on('data', function(line){
//         console.log(line)
//     });
//     parser.on('end', function(){
//         console.log(333)
//     });
//     parser.on('error', function(){
//         console.log(444)
//     });
//     clientSocket.pipe(parser);
//     console.log(111);
//     // clientSocket.on('data', function (msg) {
        
//     //     console.log(msg);
//     // });
//     clientSocket.on('end', function() {
//         console.log('== clientSocket disconnected from server');
//     });
//     clientSocket.on('error', function(err) {
//         console.error('== clientSocket has error : ' , err);
//     });

//     const welcome = `* OK [CAPABILITY IMAP4rev1 SASL-IR] Node ImapServer wellcome you!\r\n`;

//     clientSocket.write(welcome);

// });

// tcpProxyServer.on('error', function(error) {
//     console.error('== tcpProxyServer has error : ' , error);
// });

// //创建反向代理服务
// tcpProxyServer.listen(11024);

// var ImapServer = require('imap-server');
// var server = ImapServer();

// // use plugin
// var plugins = require('imap-server/plugins');
// server.use(plugins.announce);
// /* use more builtin or custom plugins... */

// var net = require('net');
// net.createServer(server).listen(11024);