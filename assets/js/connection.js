/**
 * connection.example.js
 *
 * This file contains some example, browser-side JavaScript for connecting
 * a client socket (i.e. browser tab) to your Sails backend using Socket.io.
 * It exposes a global object, `socket`, that you can
 *
 * Depending on your use case, this may or may not be the right approach.
 * This file is designed to get you up and running fast, but it's just an example.
 * Feel free to change none, some, or ALL of this file to fit your needs!
 *
 * For an annotated version of this file with additional examples, see:
 *   *-> https://gist.github.com/mikermcneil/8465536
 *
 * For more docs on using pubsub in Sails, from a client or as an API, see:
 *   *-> http://links.sailsjs.org/docs/pubsub
 */


// Immediately start connecting
socket = io.connect();

console.log('Connecting Socket.io to Sails.js...');

// Attach a listener which fires when a connection is established:
socket.on('connect', function socketConnected() {

    console.log(
        'Socket is now connected and globally accessible as `socket`.\n' +
            'e.g. to send a GET request to Sails via Socket.io, try: \n' +
            '`socket.get("/foo", function (response) { console.log(response); })`'
    );

    // Sends a request to a built-in, development-only route which which
    // subscribes this socket to the firehose, a channel which reports
    // all messages published on your Sails models on the backend, i.e.
    // publishUpdate(), publishDestroy(), publishAdd(), publishRemove(),
    // and publishCreate().
    //
    // Note that these messages are received WHETHER OR
    // NOT the current socket is actually subscribed to them.  The firehose
    // is useful for debugging your app's pubsub workflow-- it should never be
    // used in your actual app.

    socket.get('/v1/user/subscribe', function nowListeningToFirehose() {

        socket.on('user', function newMessageFromSails(message) {
            console.log('MESSAGE SOCKET::\n', message);
        });

    });







});
