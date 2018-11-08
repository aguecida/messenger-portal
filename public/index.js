$(document).ready(() => {
    let socket = io();

    socket.on('newMessage', data => {
        // Create new tab for first message in conversation
        if (!$(`#sidebar #${data.sender.id}`).length) {
            let template = $('#tab-template').html();

            let html = Mustache.render(template, {
                sender: data.sender.id,
                lastMessage: data.message.text
            });

            $('#sidebar').append(html);
        }

        // Set last message in tab preview
        $(`#sidebar #${data.sender.id} .last-message`).html(data.message.text);


        let formattedTime = moment(data.timestamp / 1000).format('h:mm a');

        let template = $('#message-template').html();

        let html = Mustache.render(template, {
            sender: data.sender.id,
            timestamp: formattedTime,
            text: data.message.text
        });

        $('.conversation').append(html);
    });
});
