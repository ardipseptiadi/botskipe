var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var DialogLabels = {
    Hotels: 'Hotels',
    Flights: 'Flights',
    Support: 'Support'
};

var OrderLabels = {
    Makanan: 'Makanan',
    Minuman: 'Minuman'
}
var connect = require('./connection');
var Conn = connect.db_conn();

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });

var bot = new builder.UniversalBot(connector, [
    function (session,args,next) {
      // console.log(session.message.from);
      session.send("Hi %s",session.message.user.name);
      session.endDialog();
    }
]);
bot.dialog('makanan',require('./makanan'));
bot.dialog('support', require('./support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });
bot.dialog('pesan', require('./pesan.js'))
    .triggerAction({
        matches: [/mau/i, /order/i,/pesan/i]
    });
bot.dialog('pesanan', function(session){
    // session.send('LIST : --- | --- |');
    // Conn.connect(function(err) {
    //     if (err) throw err;
        Conn.query("SELECT * FROM bc_pesanan", function (err, result,fields) {
            if (err) throw err;
            var list=[];
            result.forEach(function(element) {
                list.push(
                    {'type':'TextBlock','text':element.user+'-'+element.pesanan}
                    );
                // session.send(element.user+element.pesanan);
            }, this);
            console.log(list);
            var msg = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    type: "AdaptiveCard",
                    speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
                       body: 
                        list
                }
            });
            session.send(msg).endDialog();
        });
    // });
}

).triggerAction({
        matches: [/^(show|list)/i ]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});
