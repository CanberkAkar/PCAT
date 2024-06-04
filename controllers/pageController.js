const Photo = require('../models/Photo');

exports.getAboutPage = (request, response) => {

    response.render('about')
}
exports.getAddPage=(request, response) => {
    response.render('add')
}
exports.getEditPage= async (request, response) => {
    const photo = await Photo.findOne({ _id: request.params.id });
    response.render('edit', { photo })
}