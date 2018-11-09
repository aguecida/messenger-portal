![Screenshot](https://github.com/aguecida/messenger-portal/blob/master/screenshot.gif)

# Overview

The messenger portal is an application that uses the [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform/) to perform bi-directional page messaging from outside of Facebook. It consist of a webhook and a browser client application. The portal is capable of sending/receiving basic text messages and attachments.

# Configuration

The following environment variables are required for the webhook:

* HOST - The API endpoint of the webhook service
* ACCESS_TOKEN - The access token of the Facebook page that is needed to make Facebook API requests (e.g. send message)
* APP_SECRET - The secret of the Facebook app. This secret is used to hash the message payload of messages sent to the webhook. This is used to validate the origin of incoming messages to the webhook.

For development, these variables can be added to a `.env` file in the root folder.
