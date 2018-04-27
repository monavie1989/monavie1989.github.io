const socket = io('https://webrtcmagingam.herokuapp.com/');
var myPeerId;

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'peerjsmagingam.herokuapp.com', 
    secure: true, 
    port: 443
});
function openStream(){
	const config = {audio: false, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}
peer.on('open', id => {
	myPeerId = id;
	const username = makeid();
    $('#my-peer').append(username);
	
	openStream().then(function(stream){
		playStream('localStream',stream);
		window.stream = stream;
	}).catch(err => {
        console.error("failed getUserMedia", err);
    });
	
	socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
	
	//Callee
	peer.on('call', call => {
		call.answer(window.stream);
		call.on('stream', remoteStream => playStream('remoteStream'+call.peer, remoteStream));
	});
});

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
		if(myPeerId != peerId){			
			$('#online_list').append(`<div id="${peerId}"><h3 class="peer_player">User Name: ${ten}</h3><video id="remoteStream${peerId}" width="300" autoplay playsinline preload="auto"></video></div>`);
			
			const call = peer.call(peerId, window.stream);
			call.on('stream', remoteStream => playStream('remoteStream'+peerId, remoteStream));
			
		}
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#online_list').append(`<div id="${peerId}"><h3 class="peer_player">User Name: ${ten}</h3><video id="remoteStream${peerId}" width="300" autoplay playsinline preload="auto"></video></div>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
