import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: "dcvx4tnwp",
    api_key: "596258636375658",
    api_secret: "PBWzlNAuSmudhmV7BpGB-KHFk3k"
});

const uploadOnCloudinary = async (localpath: string) => {
    try {
        if (!localpath) return null;
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: 'auto'
        });
        if (response) {
            fs.unlinkSync(localpath);
            console.log("file is upload on cloudinary", response.url);
        }
        return response;
    } catch (error) {
        fs.unlinkSync(localpath)
        return null;
    }

}

const deleteonCloudinary = async (url: string) => {
    try {
        if (!url) return null;

        const urlArray = url.split('/');

        const image = urlArray[urlArray.length - 1];

        const imageName = image.split('.')[0];


        const response = await cloudinary.uploader.destroy(imageName);
        if (response) {
            console.log("file is delete on cloudinary");
        }
        return response;
    } catch (error) {
        return null;
    }
}

export { uploadOnCloudinary, deleteonCloudinary }