const Past = require('../models/PastEvent');

// @desc    Get latest 5 past events (for public view)
// @route   GET /api/getpast
// @access  Public
const getpast = async (req, res) => {
    try {
        const data = await Past.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
        ]);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No past events are there" });
        }
        res.status(200).json({ message: "Data get successfully", data: data });
    }
    catch (error) {
        res.status(500).json({ message: "Server error in the get past event" });
    }
};

// @desc    Get past events by club name (for public view)
// @route   GET /api/getpast/club/:clubName
// @access  Public
const getPastEventsByClub = async (req, res) => {
    try {
        const { clubName } = req.params;
        const decodedClubName = decodeURIComponent(clubName);
        const validClubs = ['AI build club', 'Technical club', 'Electromazine club'];

        if (!validClubs.includes(decodedClubName)) {
            return res.status(400).json({ message: "Invalid club name" });
        }

        const data = await Past.find({ clubName: decodedClubName }).sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: `No past events found for ${decodedClubName}` });
        }

        res.status(200).json({ message: `Data for ${decodedClubName} get successfully`, data: data });
    } catch (error) {
        res.status(500).json({ message: "Server error in getting past events by club" });
    }
};

module.exports = {
    getpast,
    getPastEventsByClub
};