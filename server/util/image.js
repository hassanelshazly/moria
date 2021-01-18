const cloudinary = require("cloudinary");

const cloudinaryBaseUrl = `http://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/`
const folderName = "imgs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageSrc) {
    let result = await cloudinary.v2.uploader.upload(imageSrc, {
        allowed_formats: ["jpg", "png"],
        public_id: "",
        folder: folderName,
    });
    return cloudinaryBaseUrl + result.public_id;
}

async function deleteImage(imageUrl) {
    let idx = imageUrl.lastIndexOf("/");
    let public_id = folderName + imageUrl.slice(idx);
    let result = await cloudinary.v2.uploader.destroy(public_id);
    return result;
}

module.exports = {
    uploadImage,
    deleteImage
}