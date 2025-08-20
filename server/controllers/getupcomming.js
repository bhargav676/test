const Upcoming=require('../models/UpcomingEvent')

const getPast = async (req, res) => {
  try {
    const now = new Date();
    const data = await Upcoming.aggregate([
      { $match: { eventDate: { $gt: now } } },
      { $sort: { eventDate: -1 } },
      { $limit: 5 }
    ]);

    if (!data.length) {
      return res.status(404).json({ message: "No upcomming events" });
    }

    res.status(200).json({ message: "Data fetched successfully", data });
  } catch {
    res.status(500).json({ message: "Server error in getPast" });
  }
};



module.exports=getPast