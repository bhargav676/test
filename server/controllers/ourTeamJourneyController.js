const cloudinary = require('cloudinary').v2;
const OurTeamJourney = require('../models/OurTeamJourney');

// Upload Image
const uploadOurTeamJourneyImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'our_team_journey',
            resource_type: 'auto'
        });

        const newImage = new OurTeamJourney({
            public_id: result.public_id,
            url: result.secure_url,
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully!',
            data: newImage,
        });

    } catch (error) {
        console.error('Error uploading our team journey image:', error);
        res.status(500).json({ success: false, message: 'Image upload failed.', error: error.message });
    }
};

// Get all images
const getOurTeamJourneyImages = async (req, res) => {
    try {
        const images = await OurTeamJourney.find({});
        res.status(200).json({ success: true, count: images.length, data: images });
    } catch (error) {
        console.error('Error fetching our team journey images:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images.', error: error.message });
    }
};

// Delete image
const deleteOurTeamJourneyImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await OurTeamJourney.findById(id);

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id)
                .catch(err => console.error('Error deleting image from Cloudinary:', err));
        }

        await OurTeamJourney.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Image deleted successfully!' });

    } catch (error) {
        console.error('Error deleting our team journey image:', error);
        res.status(500).json({ success: false, message: 'Image deletion failed.', error: error.message });
    }
};

const getimage=async(req,res)=>{
    try{
        const data=await OurTeamJourney.aggregate([
            {$sort:{createdAt:-1}}
        ])
        return res.status(200).json({message:"data loaded sucessfully",data:data});
    }
    catch{
        return res.status(500).json({message:"internal server error"})
    }
}

module.exports = {
    uploadOurTeamJourneyImage,
    getOurTeamJourneyImages,
    deleteOurTeamJourneyImage,
    getimage
};
