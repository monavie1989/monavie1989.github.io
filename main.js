const socket = io('https://webrtcmagingam.herokuapp.com/');

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'peerjsmagingam.herokuapp.com', 
    secure: true, 
    port: 443
});
var myPeerId;
var myStream;
function openStream(){
	const config = {audio: false, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}
openStream().then(function(stream){
	playStream('localStream',stream);
  myStream = stream;
	console.log(stream);
});
peer.on('open', id => {
	myPeerId = id;
	const username = makeid();
    $('#my-peer').append(username);
	
	console.log("myPeerId:"+myPeerId);
	socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
});
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
