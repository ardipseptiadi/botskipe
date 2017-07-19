var builder = require('botbuilder');
var MakananLabels = {
    Sabana: 'Sabana',
    Penyet: 'Penyet',
    Lainnya: 'Lainnya'
}
var connect = require('./connection');
var Conn = connect.db_conn();

module.exports = [
    function (session) {
        builder.Prompts.choice(
            session,
            'Apa yang ingin anda pesan?',
            [MakananLabels.Sabana, MakananLabels.Penyet,MakananLabels.Lainnya],
            {
                maxRetries: 3,
                retryPrompt: 'Maaf tidak ada dalam pilihan'
            });
    },

    function (session,result,args) {
        if(!result.response) {
            session.send('TIDAK ADA!!!!');
            return session.endDialog();
        }

        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        var selection = result.response.entity;
        var pesan_makan = "";
        switch (selection) {
            case MakananLabels.Sabana:
                pesan_makan = "sabana";
            case MakananLabels.Penyet:
                pesan_makan = "penyet";
            case MakananLabels.Lainnya:
                // builder.Prompts.text(session,"Silahkan tulis pesanan anda");
                // pesan_makan = results.response;
                // function (session) {

                // }
        }
        Conn.query("INSERT INTO bc_pesanan (user,pesanan,jenis) values ('"+session.message.user.name+"','"+pesan_makan+"','makanan')", function (err, result,fields) {
            if (err) throw err;
        });
        session.send('Pesanan berhasil dibuat!');
        return session.endDialogWithResult({response:true});
    }
];