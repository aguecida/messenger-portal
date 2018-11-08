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

        addMessage(data.sender.id, data.sender.id, formattedTime, data.message.text);
    });

    $(document).on('click', '.tab', event => {
        if ($(event.currentTarget).hasClass('active')) return;

        $('#sidebar').find('.tab').removeClass('active');
        $('#conversation-container').find('.conversation').removeClass('active');
        
        $(event.currentTarget).addClass('active');

        let id = $(event.currentTarget).attr('id').substring(4);
        $(`#conversation-${id}`).addClass('active');
    });

    $('button').on('click', () => {
        sendMessage();
    });

    $('textarea').on('keypress', (e) => {
        let code = (e.keyCode ? e.keyCode : e.which);

        if (code === 13) {
            e.preventDefault();
            sendMessage();
        }
    });

    function getActiveTabId() {
        let id = $('#sidebar').find('.active').attr('id');

        if (id) {
            return id.substring(4);
        }
    }

    function sendMessage() {
        let id = getActiveTabId();

        if (!id) return;

        let currentTime = new moment().format('h:mm a');
        let text = $('textarea').val();
        
        if (!text) return;

        addMessage(id, 'You', currentTime, text);

        $(`#sidebar #tab-${id} .last-message`).html(text);

        $('textarea').val('');
    }

    function addMessage(id, sender, timestamp, text) {
        let messageTemplate = $('#message-template').html();

        let messageHtml = Mustache.render(messageTemplate, {
            sender: sender,
            timestamp: timestamp,
            text: text
        });

        $(`#conversation-${id}`).append(messageHtml);
    }
});
