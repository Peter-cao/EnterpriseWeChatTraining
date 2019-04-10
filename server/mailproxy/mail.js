const net = require('net');

class ReceiveReverseProxy{
    constructor(options){
        this.local = options.local;
        this.target = options.target;

        this.init();
    }

    init(){
        this.createServer();
    }

    createServer(){
        const LOCAL_PORT = this.local.port, TARGET_PORT = this.target.port, TARGET_HOST = this.target.host;
        let invokeTime = 0;
        let tcpProxyServer = this.tcpProxyServer = net.createServer(function (clientSocket) {
            clientSocket.on('data', function (msg) {
                console.log('  ** START **');
                console.log('<< From client to proxy ' );
                // console.log('<< From client to proxy ' , msg.toString());
                //连接复用
                let serviceSocket = null;
                if ((serviceSocket = clientSocket.serviceSocket)) {
                    // console.log('<<  proxy has created ....', msg.toString());
                    serviceSocket.write(msg);
                } else {
                    const serviceSocket = new net.Socket();
                    clientSocket.serviceSocket = serviceSocket;
                    serviceSocket.connect(parseInt(TARGET_PORT), TARGET_HOST, function () {
                        // console.log('>> From proxy to remote', msg.toString());
                        serviceSocket.write(msg);
                    });
                    serviceSocket.on("data", function (data) {
                        // console.log('<< From remote to proxy', data.toString());
                        clientSocket.write(data);
                        console.log('invokeTime : ' , invokeTime ++ )
                    });
                    serviceSocket.on('end', function() {
                        console.log(' == serviceSocket disconnected from server');
                    });
                    //服务端连接出问题，断开客户端
                    serviceSocket.on('error', function(err) {
                        console.error(' == serviceSocket has error ' , err);
                        clientSocket.end();
                    });
                }
            });
            clientSocket.on('end', function() {
                console.log('== clientSocket disconnected from server');
            });
            clientSocket.on('error', function(err) {
                console.error('== clientSocket has error : ' , err);
            });

            if(TARGET_PORT!=='993'){
                const welcome = `* OK [CAPABILITY IMAP4rev1 SASL-IR] Node ImapProxy wellcome you!\r\n`;
                clientSocket.write(welcome);
            }
            
        });



        tcpProxyServer.on('error', function(error) {
            console.error('== tcpProxyServer has error : ' , error);
        });

        //创建反向代理服务
        tcpProxyServer.listen(LOCAL_PORT);
        console.log(" Receive server accepting connection on port: " + LOCAL_PORT);

        /*
        * 300 毫秒检测连接
        * */
        // var periodServerTest = setInterval(function(){
        // } , 300) ;
    }
}



const SMTPServer = require('smtp-server').SMTPServer;
const nodemailer = require('nodemailer');
const simpleParser = require('mailparser').simpleParser;

class SendReverseProxy{
    constructor(options){
        this.local = options.local;
        this.target = options.target;

        this.init();
    }

    init(){
        this.createServer();
    }

    createServer(){
        const LOCAL_PORT = this.local.port, TARGET_PORT = this.target.port, TARGET_HOST = this.target.host;

        const server = new SMTPServer({
            // log to console
            logger: false,
        
            // disable STARTTLS to allow authentication in clear text mode
        
            // not required but nice-to-have
            hideSTARTTLS: true,
        
            onAuth(auth, session, callback) {
                session.auth = auth;
                callback(null, {
                    user: 'userdata' // value could be an user id, or an user object etc. This value can be accessed from session.user afterwards
                })
            },

            // If this method is not set, all addresses are allowed
            onMailFrom(address, session, callback) {
                // if(address.address!=='test@nationsky.com'){
                //     return callback(new Error('no permission'))
                // }
                session.address = address;
                callback();
            },
        
            // Handle message stream
            onData(stream, session, callback) {

                
                let isValidate = true;
                // 发送前做一些鉴权判断
                // if(session.auth.username.indexOf('huangnan')>-1){
                //     isValidate = false;
                // }
                
                simpleParser(stream, (err, mail) => {
                    if(err) return console.error(err);

                    var transporter = nodemailer.createTransport({
                        port: TARGET_PORT,
                        host: TARGET_HOST,
                        auth: {
                            user: session.auth.username,//发送者邮箱
                            pass: session.auth.password //邮箱第三方登录授权码
                        },
                        secure: TARGET_PORT===465, // 465端口需要设置为true，否则为false
                        debug: true,
                        ignoreTLS: true
                    });
                    mail.from = session.auth.username;
                    mail.to = mail.to.value; // 单独设置to，为什么？
                    if(isValidate){
                        // console.log(mail)
                        transporter.sendMail(mail, (error, info) => {
                            if (error) {
                                console.log('Error occurred');
                                console.log(error.message);
                                return;
                            }
                            console.log('Message sent successfully!');
                            console.log('Server responded with "%s"', info.response);
                            transporter.close();
                        });
                    }
                    
                });
        
                
                stream.on('end', () => {
                    let err;
                    if(!isValidate){
                        err = new Error('Error: no permision');
                        err.responseCode = 552;
                    }else if (stream.sizeExceeded) {
                        err = new Error('Error: message exceeds fixed maximum message size 10 MB');
                        err.responseCode = 552; 
                    }
                    if(err) return callback(err);
                    callback(null, 'Message queued as abcdef'); // accept the message once the stream is ended
                });
        
            }
        });
        
        server.on('error', err => {
            console.log('Error occurred');
            console.log(err);
        });
        
        // start listening
        server.listen(LOCAL_PORT);

        console.log(" Send server accepting connection on port: " + LOCAL_PORT);
    }
}


module.exports = {
    ReceiveReverseProxy: ReceiveReverseProxy,
    SendReverseProxy: SendReverseProxy
}