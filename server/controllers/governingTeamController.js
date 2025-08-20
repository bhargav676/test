const cloudinary = require('cloudinary').v2;
const GoverningTeam = require('../models/GoverningTeam');

const uploadGoverningTeamMember = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { name, designation } = req.body;

        if (!name || !designation) {
            return res.status(400).json({ success: false, message: 'Name and designation are required.' });
        }

        const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'governing_team',
            resource_type: 'auto'
        });

        const newMember = new GoverningTeam({
            public_id: result.public_id,
            url: result.secure_url,
            name: name,
            designation: designation,
        });

        await newMember.save();

        res.status(201).json({
            success: true,
            message: 'Governing team member uploaded successfully!',
            data: newMember,
        });

    } catch (error) {
        console.error('Error uploading governing team member:', error);
        res.status(500).json({ success: false, message: 'Governing team member upload failed.', error: error.message });
    }
};

const getGoverningTeamMembers = async (req, res) => {
    try {
        const members = await GoverningTeam.find({});
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (error) {
        console.error('Error fetching governing team members:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch governing team members.', error: error.message });
    }
};


const getGoverningTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await GoverningTeam.findById(id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Governing team member not found.' });
        }
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        console.error(`Error fetching governing team member by ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch governing team member.', error: error.message });
    }
};

// New Function
const updateGoverningTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation } = req.body;
        let updateData = { name, designation };

        const existingMember = await GoverningTeam.findById(id);
        if (!existingMember) {
            return res.status(404).json({ success: false, message: 'Governing team member not found.' });
        }

        if (req.file) {
            if (existingMember.public_id) {
                await cloudinary.uploader.destroy(existingMember.public_id)
                    .catch(destroyError => console.error('Error deleting old governing team image from Cloudinary:', destroyError));
            }

            const uploadSource = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(uploadSource, {
                folder: 'governing_team',
                resource_type: 'auto'
            });

            updateData.public_id = result.public_id;
            updateData.url = result.secure_url;
        }

        const updatedMember = await GoverningTeam.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedMember) {
            return res.status(500).json({ success: false, message: 'Failed to update governing team member in database.' });
        }

        res.status(200).json({
            success: true,
            message: 'Governing team member updated successfully!',
            data: updatedMember,
        });

    } catch (error) {
        console.error('Error updating governing team member:', error);
        res.status(500).json({ success: false, message: 'Governing team member update failed.', error: error.message });
    }
};

// New Function
const deleteGoverningTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await GoverningTeam.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Governing team member not found.' });
        }

        if (member.public_id) {
            await cloudinary.uploader.destroy(member.public_id)
                .catch(destroyError => console.error('Error deleting governing team image from Cloudinary:', destroyError));
        }

        await GoverningTeam.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Governing team member deleted successfully!' });

    } catch (error) {
        console.error('Error deleting governing team member:', error);
        res.status(500).json({ success: false, message: 'Governing team member deletion failed.', error: error.message });
    }
};


module.exports = {
    uploadGoverningTeamMember,
    getGoverningTeamMembers,
    getGoverningTeamMemberById, 
    updateGoverningTeamMember,  
    deleteGoverningTeamMember,  
};