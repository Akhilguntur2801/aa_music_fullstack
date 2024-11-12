import { v2 as cloudinary } from 'cloudinary'
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
    try {
        console.log('addAlbum route hit');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file;

        if (!imageFile) {
            console.log('No file uploaded');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        console.log('Image uploaded to Cloudinary:', imageUpload.secure_url);

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url,
        };

        const album = new albumModel(albumData);
        await album.save();
        console.log('Album saved to database:', album);

        res.json({ success: true, message: "Album Added" });

    } catch (error) {
        console.error('Error adding album:', error);
        res.json({ success: false, message: 'Failed to add album', error: error.message });
    }
};



const listAlbum = async (req, res) => {
    try {

        const allAlbums = await albumModel.find({});
        res.json({ success: true, albums: allAlbums });

    } catch (error) {

        res.json({ success: false });

    }

}


const removeAlbum = async (req, res) => {
    try {

        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album Removed" });

    } catch (error) {

        res.json({ success: false });
        
    }

}

export { addAlbum, listAlbum, removeAlbum   }