const config = require('../config/config.json');
const db = require('../models/index.js');




module.exports = {    
listSummary, 
 listLines
};



async function listSummary(req) {  
    try {      
        const totalLines = await db.Station.count({ distinct: true, col: "lineId" });
        const totalStations = await db.Station.count();
        const styles = await db.Style.count({ distinct: true, col: "id" });
        const offlineStations = await db.Station.count({ where: { status: "offline" } });  
        
      // Return the users with their contact details
      return {
        status: 200,
        data:{ totalLines, totalStations, styles, offlineStations }
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  
  async function listLines(req) {
    try {
        const { lineId } = req.params;

        if (!lineId) {
            return res.status(400).json({ success: false, error: "lineId is required" });
        }

        // Fetch all stations for the given lineId
        const stations = await db.Station.findAll({ where: { lineId }, raw: true });

        console.log("Fetched Stations:", stations);

        // ✅ Ensure stations is an array and not empty
        if (!Array.isArray(stations) || stations.length === 0) {
            return res.status(404).json({ success: false, error: "No stations found for this line" });
        }

        // ✅ Check if all stations are valid before mapping
        stations.forEach((station, index) => {
            if (!station || typeof station !== "object") {
                console.error(`❌ Invalid station at index ${index}:`, station);
            }
        });

        // ✅ Ensure all stations have valid properties before returning
        const sanitizedStations = stations.map(station => ({
            id: station?.id || 0,
            name: station?.name || "Unknown Station",
            target: station?.target || 0,
            actual: station?.actual || 0,
            difference: station?.difference || 0,
            status: station?.status || "unknown",
            lineId: station?.lineId || 0,
            styleId: station?.styleId || 0,
        }));
        return {
            status: 200,
            data:sanitizedStations
          };
       // return  status(200).json({ success: true, data: sanitizedStations });

    } catch (error) {
        console.error("Error fetching stations:", error);
        throw error;
    }
}
