const cloudinary = require("cloudinary");

const cloudinaryBaseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/`

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageSrc) {
    let result = await cloudinary.v2.uploader.upload(imageSrc, {
        allowed_formats: ["jpg", "png"],
        public_id: "",
        folder: "imgs",
    });
    return cloudinaryBaseUrl + result.public_id;
}

module.exports = {
    uploadImage
}