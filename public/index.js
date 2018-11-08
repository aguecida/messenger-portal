$(document).ready(() => {
    let socket = io();

    socket.on('newMessage', data => {
        // Create new tab for first message in conversation
        if (!$(`#tab-${data.sender.id}`).length) {
            let conversationTemplate = $('#conversation-template').html();
            let tabTemplate = $('#tab-template').html();

            let isFirstTab = $('#sidebar').children().length === 0;

            let conversationHtml = Mustache.render(conversationTemplate, {
                sender: data.sender.id,
                active: isFirstTab ? 'active': ''
            });

            let tabHtml = Mustache.render(tabTemplate, {
                sender: data.sender.id,
                lastMessage: data.message.text,
                active: isFirstTab ? 'active' : ''
            });
            
            $('#sidebar').append(tabHtml);
            $('#conversation-container').append(conversationHtml);
        }

        // Set last message in tab preview
        $(`#sidebar #tab-${data.sender.id} .last-message`).html(data.message.text);

        let formattedTime = moment(data.timestamp / 1000).format('h:mm a');

        let messageTemplate = $('#message-template').html();

        let messageHtml = Mustache.render(messageTemplate, {
            sender: data.sender.id,
            timestamp: formattedTime,
            text: data.message.text
        });

        $(`#conversation-${data.sender.id}`).append(messageHtml);
    });

    $(document).on('click', '.tab', event => {
        if ($(event.currentTarget).hasClass('active')) return;

        $('#sidebar').find('.tab').removeClass('active');
        $('#conversation-container').find('.conversation').removeClass('active');
        
        $(event.currentTarget).addClass('active');

        let id = $(event.currentTarget).attr('id').substring(4);
        $(`#conversation-${id}`).addClass('active');
    });
});
