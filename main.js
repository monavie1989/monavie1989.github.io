const socket = io('https://webrtcmagingam.herokuapp.com/');

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'peerjsmagingam.herokuapp.com', 
    secure: true, 
    port: 443
});
var myPeerId;
var myStream;
openStream().then(stream => function(){
	playStream('localStream', stream);
	myStream = stream;
});
peer.on('open', id => {
	myPeerId = id;
	const username = makeid();
    $('#my-peer').append(username);
	
	console.log("myPeerId:"+myPeerId);
	socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
});

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	console.log("DANH_SACH_ONLINE");
	console.log(arrUserInfo);
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
		if(myPeerId != peerId){			
			$('#online_list').append(`<div id="${peerId}"><h3 id="my-peer">User Name: ${ten}</h3><video id="remoteStream${peerId}" width="300" controls></video></div>`);
			
			const call = peer.call(peerId, myStream);
			call.on('stream', remoteStream => playStream('remoteStream'+id, remoteStream));
			
		}
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#online_list').append(`<div id="${peerId}"><h3 id="my-peer">User Name: ${ten}</h3><video id="remoteStream${peerId}" width="300" controls></video></div>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

//Callee
peer.on('call', call => {
	call.answer(myStream);
	call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
});
function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/*
$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
*/