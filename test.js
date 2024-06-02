const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to the database
mongoose.connect('mongodb://localhost/pcat-test-db')
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection error:', err));

// Create schema
const photoSchema = new Schema({
    title: String,
    description: String
});
const Photo = mongoose.model('Photo', photoSchema);

// Create a photo
// Photo.create({
//     title: "Photo Title2",
//     description: "Testtir2"
// });

// Read photos
// async function photoData() {
//     const photos = await Photo.find({});
//     photos.forEach(function(data) {
//         console.log(data);
//     });
// }
// photoData();

// Update photo

// İŞLEMLERİ YAPARKEN MUTLAKA ASYC BIR FONKSİYON OLMALI
// async function updatePhoto() {
//     try {
//         const updatedPhoto = await Photo.findByIdAndUpdate(
//             id,
//             {
//                 title: "Photo Title Change",
//                 description: "Photo Desc Update"
//             },
//             { new: true } // To return the updated document
//         );
//         console.log(updatedPhoto);
//     } catch (err) {
//         console.error(err);
//     }
// }

// updatePhoto();

const id = '6651fa629cdb278fee8f4daa';
async function deletePhoto() {
    try {
        const deletedPhoto = await Photo.findByIdAndDelete(id);
        if (deletedPhoto) {
            console.log('Silinen fotoğraf:', deletedPhoto);
        } else {
            console.log('Belirtilen ID ile eşleşen fotoğraf bulunamadı.');
        }
    } catch (err) {
        console.error('Fotoğraf silinirken bir hata oluştu:', err);
    }
}
deletePhoto();
