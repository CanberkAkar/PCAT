//KENDİ PROJEMİZ İÇERİSİNDE ÇALIŞIRKEN DOSYALARIN HEPSİNİN GIT'DE OLMASINI İSTEMEYİZ.
//GITIGNORE GÖZÜKMEMESİNİ SAĞLAR.
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const port = 5050;
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const photoController=require('./controllers/photoControllers');
const pageController=require('./controllers/pageController');

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

//YOLLARI AYNI OLSA BİLE YAPTIKLARI İŞLEMLERLE İŞLEMLER;
//FARKLI GÖREVLER YAPMAKTADIR.

//BURADA YAPTIĞIM HATA ŞU PUT KISMINDAKİ LİNKE PHOTO YAZMIŞTIM.
//FAKAT AÇILAN LİNK PHOTOPAGE'DI İŞLEMİ ASLINDA BU LİNKTE YAPIYORDUM.
//EĞER CSS DOSYALARIN YÜKLENMİYORSA IMPORTLARI KONTROL ET ÇÜNKÜ SPESİFİK SAYFA AÇILIRKEN CSS'LER BOZULABİLİYOR.

app.get('/', photoController.getAllPhotos);
app.get('/photoPage/:id',photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photoPage/:id', photoController.updatePhoto);
app.delete('/photoPage/:id', photoController.deletePhoto);
app.get('/about',pageController.getAboutPage);
app.get('/add', pageController.getAddPage);

app.get('/photoPage/edit/:id', pageController.getEditPage);

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});
