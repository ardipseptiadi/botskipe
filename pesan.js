var builder = require('botbuilder');
var OrderLabels = {
    Makanan: 'Makanan',
    Minuman: 'Minuman',
    Lainnya: 'Lainnya'
}
module.exports = [
    
    function (session) {
        // Reply and return to parent dialog
        builder.Prompts.choice(
            session,
            'Apa yang ingin anda pesan?',
            [OrderLabels.Makanan, OrderLabels.Minuman,OrderLabels.Lainnya],
            {
                maxRetries: 3,
                retryPrompt: 'Maaf tidak ada dalam pilihan'
            });
    },

    function (session,result) {
        if(!result.response) {
            session.send('TIDAK ADA!!!!');
            return session.endDialog();
        }

        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        var selection = result.response.entity;
        switch (selection) {
            case OrderLabels.Makanan:
                return session.beginDialog('makanan');
            case OrderLabels.Minuman:
                return session.beginDialog('minuman');
        }
    }
];


// bot.dialog('makanan', require('./makanan'));
// bot.dialog('minuman', require('./minuman'));
