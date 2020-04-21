const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(express.json()); // untuk post

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const users = [];
const songs = [];
const playlists = [];

app.post('/registerUser', (req, res) => {
    var status;
    var msg;
    const u = users.find(c => c.email == req.body.email);
    if(u){
        status="Fail";
        msg="Registrasi gagal! Email sudah terpakai sebelumnya";
    }else{
        const user = {
            id_user: users.length + 1,
            email: req.body.email,
            nama: req.body.nama,
            password: req.body.password,
            tipe: req.body.tipe
        };
        users.push(user);
        status="Success";
        msg=`Registrasi user ${req.body.email} berhasil!`;
    }
    const obj = {
        status: status,
        msg: msg
    };
    res.send(obj);
    console.log(users);
});

app.post('/uploadSong', (req, res) => {
    var status;
    var msg=[];
    const u = users.find(c => c.id_user == req.body.id_user);
    const s = songs.find(c => c.judul == req.body.judul);
    var check;
    if(!u){
        status="Fail";
        msg.push("Pengguna tidak ditemukan");
    }else{
        if(u.tipe==0){
            status="Fail";
            msg.push("Pengguna tidak mempunyai hak untuk mengupload lagu");
        }else{
            check=1;
        }
    }
    if(s){
        status="Fail";
        msg.push("Judul lagu sudah ada sebelumnya");
    }
    if(u && check==1 && !s){
        const song = {
            id_song: songs.length + 1,
            judul: req.body.judul,
            genre: req.body.genre,
            durasi: req.body.durasi,
            id_user: req.body.id_user
        };

        songs.push(song);
        status="Success";
        msg=`Upload lagu dengan judul ${req.body.judul} berhasil!`;
    }
    const obj = {
        status: status,
        msg: msg
    };
    res.send(obj);
});

app.post('/createPlaylist', (req, res) => {
    var collection = req.body.id_lagu.split(",");
    var checked_col=[];
    var err_song;
    for (var i = 0; i < collection.length; i++) {
        collection[i] = parseInt(collection[i]);
        const s = songs.find(c => c.id_song == collection[i]);
        if(s) checked_col.push(collection[i]);
        else err_song=1;
    }

    var status;
    var msg=[];
    const u = users.find(c => c.email == req.body.email);
    if(u){
        if(checked_col.length>0){
            const playlist = {
                id_playlist: playlists.length + 1,
                email: req.body.email,
                judul_playlist: req.body.judul_playlist,
                collection_lagu: checked_col
            };
            playlists.push(playlist);
            console.log(playlist);
            status="Success";
            if(err_song) msg=`Playlist dengan judul ${req.body.judul_playlist} berhasil dibuat, tapi ada lagu yang tidak ditemukan!`;
            else msg=`Playlist dengan judul ${req.body.judul_playlist} berhasil dibuat!`;
            
        }else{
            status="Fail";
            msg=`Koleksi lagu kosong!`;
        }
    }else{
        status="Fail";
        msg=`Email tidak ditemukan!`;
    }
    const obj = {
        status: status,
        msg: msg
    };
    res.send(obj);
});

app.get('/showDummies', (req, res) => {
    var arrObj =[{
        Nama: "Budi",
        Umur: "20 Tahun"
    },{
        Nama: "Patrick",
        Umur: "21 Tahun"
    }
    ];
    res.send(arrObj);
});

app.get('/searchSongByKeyword/:keyword', (req, res) => {
    //const song = songs.find(c => c.judul == req.params.id.match(req.params.keyword));
    const arrSong=[];
    songs.forEach(s => {
        var judul = s.judul+"";
        judul = judul.toLowerCase();
        var genre = s.genre+"";
        genre = genre.toLowerCase();
        if(judul.match(req.params.keyword.toLowerCase()) || genre.match(req.params.keyword.toLowerCase())){
            arrSong.push(s);
        }
    });
    res.send(arrSong);
});

app.delete('/deleteSong/:judul', (req, res) => {
    var status;
    var msg;
    const song = songs.find(c => c.judul == req.params.judul);
    if (!song){
        status="Fail";
        msg = "Judul lagu tidak ditemukan";
    }else{
        const index = songs.indexOf(song);
        //splice(index, jumlah);
        songs.splice(index, 1);
        status="Success";
        msg = `Lagu dengan judul ${req.params.judul} telah dihapus`;
    }

    const obj = {
        status: status,
        msg: msg
    };
    res.send(obj);
});

app.get('/getPlaylist/:emailpengguna', (req, res) => {
    const arrPlaylist=[];
    playlists.forEach(p => {
        if(p.email.match(req.params.emailpengguna)){
            const obj = {
                id_playlist: p.id_playlist,
                judul_playlist: p.judul_playlist,
                collection_lagu: p.collection_lagu
            };
            arrPlaylist.push(obj);
        }
    });
    res.send(arrPlaylist);
});

app.put('/updatePlaylist/:idplaylist', (req, res) => {
    var status;
    var msg;
    const playlist = playlists.find(c => c.id_playlist == req.params.idplaylist);

    if (!playlist){
        status="Fail";
        msg = "Id Playlist tidak ditemukan";
    }else{
        playlist.judul_playlist = req.body.nama;
        status="Success";
        msg = `Nama playlist berhasil diganti menjadi ${req.body.nama}`;
    }

    const obj = {
        status: status,
        msg: msg
    };
    res.send(obj);
});
 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port '+port+'...'));