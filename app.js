//KENDİ PROJEMİZ İÇERİSİNDE ÇALIŞIRKEN DOSYALARIN HEPSİNİN GIT'DE OLMASINI İSTEMEYİZ.
//GITIGNORE GÖZÜKMEMESİNİ SAĞLAR.
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Photo = require('./models/Photo');
const port = 5050;
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');
mongoose.connect('mongodb://localhost/pcat-test-db')
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection error:', err));


//TEPMLATE ENGINE
app.set('view engine', "ejs");
//MIDDLEWARE
// const myLogger=(req,res,next)=>{
//     console.log("middleware log 1");
//     next();
// }
// const myLogger2=(req,res,next)=>{
//     console.log("middleware log 2");
//     next();
// }
//next kullanmamızın sebebi kullanılmadığı taktirde res ve req arasında gidip gelir

//middleware: request response döngüsü içerisindeki her şeye denir. her şey bu ikisnini arasında yazılır.

//statik dosyalarımız için public klasörünü kullan
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));
//ROUTES

app.get('/', async (request, response) => {
    const photos = await Photo.find({});
    response.render('index', { photos })
});
app.get('/about', (request, response) => {

    response.render('about')
});
//EĞER CSS DOSYALARIN YÜKLENMİYORSA IMPORTLARI KONTROL ET ÇÜNKÜ SPESİFİK SAYFA AÇILIRKEN CSS'LER BOZULABİLİYOR.

app.get('/photoPage/:id', async (request, response) => {
    console.log(request.params.id);
    const photos = await Photo.findById(request.params.id);
    response.render('photo', { photos });
});

app.get('/add', (request, response) => {
    response.render('add')
});

app.get('/photoPage/edit/:id', async (request, response) => {
    const photo = await Photo.findOne({ _id: request.params.id });
    response.render('edit', { photo })
});

//YOLLARI AYNI OLSA BİLE YAPTIKLARI İŞLEMLERLE İŞLEMLER;
//FARKLI GÖREVLER YAPMAKTADIR.
app.post('/photos', async (request, response) => {
    //görselle ilgili verilere ulaşırız.
    //console.log(request.files.image);
    // await Photo.create(request.body);
    // response.redirect('/');
    const uploadDir = 'public/uploads';
    //ÖNCE BUNU YAPSIN DİYE SYNC YAPSIN.
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    let uploadedImage = request.files.image;
    let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath,
        async () => {
            await Photo.create({
                ...request.body,
                image: '/uploads/' + uploadedImage.name
            });
            response.redirect('/');
        }
    );
});

//BURADA YAPTIĞIM HATA ŞU PUT KISMINDAKİ LİNKE PHOTO YAZMIŞTIM.
//FAKAT AÇILAN LİNK PHOTOPAGE'DI İŞLEMİ ASLINDA BU LİNKTE YAPIYORDUM.
app.put('/photoPage/:id', async (req, res) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id });
        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        photo.title = req.body.title;
        photo.description = req.body.description;
        await photo.save(); // Save işlemini beklemek için await kullanın

        res.redirect(`/photoPage/${req.params.id}`);
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).send('Server Error');
    }
});

app.delete('/photoPage/:id', async (req, res) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id });
        if (!photo) {
            return res.status(404).send('Photo not found');
        }
        
        let deletedImage = path.join(__dirname, 'public', photo.image);  // Use path.join to construct the path
        fs.unlinkSync(deletedImage);
        
        await Photo.findByIdAndDelete(req.params.id);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).send('An error occurred while deleting the photo');
    }
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});