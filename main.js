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
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	console.log("DANH_SACH_ONLINE:");
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
	    	
		if(myPeerId != peerId){	
			console.log("DANH_SACH_ONLINE:"+peerId);
			$('#online_list').append(`<div id="video-${peerId}"><h3 class="peer-video">User Name: ${peerId}</h3><video id="${peerId}" width="300" controls></video></div>`);
			
			const call = peer.call(peerId, myStream);
			console.log("cal to:"+peerId);
			call.on('stream', remoteStream => playStream(peerId, remoteStream));
			
		}
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
	    console.log("CO_NGUOI_DUNG_MOI:"+peerId);
        $('#online_list').append(`<div id="video-${peerId}"><h3 class="peer-video">User Name: ${peerId}</h3><video id="${peerId}" width="300" controls></video></div>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

//Callee
peer.on('call', call => {
	call.answer(myStream);
	console.log("peer on call from"+call.peer);
	call.on('stream', remoteStream => playStream(call.peer, remoteStream));
});
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
