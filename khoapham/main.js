const socket = io('webrtcmagingam.herokuapp.com');
var peers = [];
//$('#div-chat').hide();
function openStream() {
    const config = { audio: true, video: false };
    //const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    console.log("playStream");
    console.log(idVideoTag);
    console.log(stream);
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
openStream().then(stream => {
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
        var newidconnect = makeidconnect(user.ten, username);
        const isExist = peers.some(e => e.idconnect === newidconnect);
        if (!isExist){
            var new_peer = new Peer({ 
                key: 'peerjs', 
                host: 'peerjsmagingam.herokuapp.com', 
                secure: true, 
                port: 443, 
            });        
            new_peer.on('open', id => {
                var peer = {idconnect: newidconnect, peerid: id};
                peers.push(peer);
                socket.emit('TAO_PEER_MOI',peer);
                console.log("emit new peer");
                console.log(peer);
            });
            $('#ulUser').append(`<li id="${newidconnect}">${newidconnect}<br><video width="300" controls playsinline id="video_${newidconnect}"></li>`);
            //Callee
            new_peer.on('call', call => {
                console.log('new_peer call answer');
                call.answer(window.stream);
                updateNumberClient();
                call.on('stream', remoteStream => playStream(`video_${newidconnect}`, remoteStream));
            });
        }        
    });
});
socket.on('AI_DO_NGAT_KET_NOI', function(ten, arrConnectionRemove) {
    console.log("AI_DO_NGAT_KET_NOI:"+ten);
    console.log(arrConnectionRemove);
    for (var i = 0; i < arrConnectionRemove.length; i++) {
        $(`#${arrConnectionRemove[i]}`).remove();
    }
    updateNumberClient();    
});
socket.on('CALL_TO_PEER_MOI', (peer,ten) => {
    console.log('CALL_TO_PEER_MOI');
    console.log(peer);
    console.log(ten);
    var check_idconnect = makeidconnect(ten, username);
    if(check_idconnect == peer.idconnect){
        var new_peer = new Peer({ 
            key: 'peerjs', 
            host: 'peerjsmagingam.herokuapp.com', 
            secure: true, 
            port: 443, 
        }); 
        console.log(`create element #video_${peer.idconnect}`);
        $('#ulUser').append(`<li id="${peer.idconnect}">${peer.idconnect}<br><video width="300" controls playsinline id="video_${peer.idconnect}"></li>`);
        new_peer.on('open', id => {
            console.log('new_peer open call');
            var call = new_peer.call(peer.peerid, window.stream);        
            call.on('stream', function(remoteStream){
                playStream(`video_${peer.idconnect}`, remoteStream);
                updateNumberClient();
            });
        });
    }
});
function updateNumberClient(){
    if($("#ulUser li").length == 0){
        $('body').removeClass("connected");
        $("#ulUser").attr("class","");
    }else{
        $('body').addClass("connected");
        $("#ulUser").attr("class","connect"+$("#ulUser li").length);
    }
}


socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
function makeidconnect(key1, key2){
    if(key1 < key2){
        return key1+key2;
    }else{
        return key2+key1;
    }
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
