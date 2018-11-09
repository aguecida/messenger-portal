$(document).ready(() => {
    let socket = io();
    let endpoint;

    socket.on('config', data => {
        endpoint = data.endpoint;
    });

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

        if (data.message.attachments && data.message.attachments.length > 0) {
            let attachment = data.message.attachments[0];

            if (attachment.type === 'image') {
                let url = attachment.payload.url;

                $(`#sidebar #tab-${data.sender.id} .last-message`).html('<i>New attachment</i>');

                addMessage(data.sender.id, data.sender.id, 'them', null, url);
            }
        }
        else {
            // Set last message in tab preview
            $(`#sidebar #tab-${data.sender.id} .last-message`).html(data.message.text);

            addMessage(data.sender.id, data.sender.id, 'them', data.message.text, null);
        }
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

        let text = $('textarea').val();
        
        if (!text) return;

        addMessage(id, 'You', 'you', text);

        $(`#sidebar #tab-${id} .last-message`).html(text);

        $('textarea').val('');

        let data = {
            recipient: { id },
            message: { text }
        };
        
        $.ajax({
            url: `${endpoint}/send`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function() {
                console.log('Sent message successfully!');
            },
            error: function() {
                alert('Error sending message!');
            }
        });
    }

    function addMessage(id, sender, type, text, imageUrl) {
        let timestamp = new moment().format('h:mm a');

        let messageTemplate = $('#message-template').html();

        let messageHtml = Mustache.render(messageTemplate, {
            sender,
            type,
            timestamp,
            text,
            imageUrl
        });

        $(`#conversation-${id}`).append(messageHtml);
        $(`#conversation-${id}`).scrollTop(9999999);
    }
});
