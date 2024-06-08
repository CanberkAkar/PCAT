const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (request, response) => {
    // console.log(request.query);
 
    const page =request.query.page || 1;
    const photosPerPage= 2;
    const totalPhotos= await Photo.find().countDocuments();
    const photos = await Photo.find({})
    .sort('-dataCreated')
    .skip((page-1)*photosPerPage)
    .limit(photosPerPage)

    response.render('index', 
    { 
        photos  : photos , 
        current : page,
        pages   : Math.ceil(totalPhotos/photosPerPage)
    }
    );

}

exports.getPhoto= async (request, response) => {
    console.log(request.params.id);
    const photos = await Photo.findById(request.params.id);
    response.render('photo', { photos });
}
exports.createPhoto= async (request, response) => {
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
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath,
        async () => {
            await Photo.create({
                ...request.body,
                image: '/uploads/' + uploadedImage.name
            });
            response.redirect('/');
        }
    );
}

exports.updatePhoto=async (req, res) => {
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
}

exports.deletePhoto=async (req, res) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id });
        if (!photo) {
            return res.status(404).send('Photo not found');
        }
        
        let deletedImage = __dirname + '/../public' + photo.image;
        fs.unlinkSync(deletedImage);
        
        await Photo.findByIdAndDelete(req.params.id);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting photo:', __dirname);
        res.status(500).send('An error occurred while deleting the photo');
    }
}