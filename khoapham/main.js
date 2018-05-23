const socket = io('webrtcmagingam.herokuapp.com');
var peers = {};
//$('#div-chat').hide();
function openStream() {
    const config = { audio: true, video: false };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
openStream().then(stream => {
    console.log("openStream:");
    console.log(stream);
    window.stream = stream;
    playStream('localStream', window.stream);
});
const username = makeid();
$("#username").text(username);
socket.emit('NGUOI_DUNG_DANG_KY', { ten: username });
console.log("NGUOI_DUNG_DANG_KY:"+username);
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    console.log("DANH_SACH_ONLINE:");
    console.log(arrUserInfo);
    arrUserInfo.forEach(user => {
            peers[user.ten] = new Peer({ 
            key: 'peerjs', 
            host: 'peerjsmagingam.herokuapp.com', 
            secure: true, 
            port: 443, 
            //config: customConfig 
        });
        $('#ulUser').append(`<li id="${user.ten}">${user.ten}<br><video width="300" controls></video></li>`);
    });
    socket.emit('NGUOI_DUNG_DANG_KY_SUCCESS', { ten: username , peer_list: peers[user.ten]});
    console.log("NGUOI_DUNG_DANG_KY_SUCCESS");
    console.log(peers);
});

socket.on('NGUOI_DUNG_DANG_KY_SUCCESS', user => {
    console.log("NGUOI_DUNG_DANG_KY_SUCCESS:");
    console.log(user);
    $('#ulUser').append(`<li id="${user.ten}">${user.ten}<br><video width="300" controls></video></li>`);
});
socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
/*
$('#div-chat').hide();
let customConfig;

$.ajax({
  url: "https://service.xirsys.com/ice",
  data: {
    ident: "vanpho",
    secret: "2b1c2dfe-4374-11e7-bd72-5a790223a9ce",
    domain: "vanpho93.github.io",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

*/




// openStream()
// .then(stream => playStream('localStream', stream));



//Caller
/*
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

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

const peer = new Peer({ 
    key: 'peerjs', 
    host: 'peerjsmagingam.herokuapp.com', 
    secure: true, 
    port: 443, 
    //config: customConfig 
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});
//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

function callTo(id){
  openStream()
  .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  });
}
*/
