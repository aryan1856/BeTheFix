import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import fs from "fs"

dotenv.config({})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_secret:process.env.CLOUDINARY_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY
})
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            // console.log("File path doesn't exist")
            return null;}
        // console.log("localFilePath")
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // console.log("File uploaded",response.url)
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("error uploading file",error.message)
        fs.unlinkSync(localFilePath);
        return null;
    }
};
export default cloudinary
