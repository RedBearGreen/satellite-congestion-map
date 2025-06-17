const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const SPACE_TRACK_URL = 'https://www.space-track.org';
    const USERNAME = process.env.SPACE_TRACK_USERNAME; // Use .env for security
    const PASSWORD = process.env.SPACE_TRACK_PASSWORD;

    try {
        // Authenticate with Space-Track
        const loginResponse = await fetch(`${SPACE_TRACK_URL}/ajaxauth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `identity=${USERNAME}&password=${PASSWORD}`
        });
        const cookies = loginResponse.headers.get('set-cookie');

        // Fetch TLE data
        const tleResponse = await fetch(`${SPACE_TRACK_URL}/basicspacedata/query/class/tle_latest/ORDINAL/1/NORAD_CAT_ID/25544,40000--50000/format/3le`, {
            headers: { Cookie: cookies }
        });
        const tleText = await tleResponse.text();

        // Split into array
        const tleArray = tleText.trim().split('\n0 ').slice(1).map(tle => '0 ' + tle);
        res.status(200).json(tleArray);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TLE data' });
    }
};