//KENDİ PROJEMİZ İÇERİSİNDE ÇALIŞIRKEN DOSYALARIN HEPSİNİN GIT'DE OLMASINI İSTEMEYİZ.
//GITIGNORE GÖZÜKMEMESİNİ SAĞLAR.
const express = require('express');
const app = express();
const path= require('path');

const port = 5050;

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


app.get('/',(request,response)=>{
    response.sendFile(path.resolve(__dirname,'temp/index.html'))
});
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});