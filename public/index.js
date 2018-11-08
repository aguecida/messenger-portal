$(document).ready(function() {
    let socket = io();

    socket.on('newMessage', function(data) {
        debugger;
    });
});
