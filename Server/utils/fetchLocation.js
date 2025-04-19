import axios from 'axios';

const fetchLocation = async (longitude, latitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  let area = "Unknown area";
  let city = "Unknown city";
  let country = "Unknown country";

  try {
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': 'BeTheFix/1.0 (contact@bethefix.com)',
      },
    });

    if (geoRes.data?.address) {
      const address = geoRes.data.address;
      area = address.suburb || address.neighbourhood || address.village || address.hamlet || "Unknown area";
      city = address.city || address.town || address.village || "Unknown city";
      country = address.country || "Unknown country";
    }
  } catch (geoError) {
    console.warn("Reverse geocoding failed:", geoError.message);
  }

  return {
    area,
    city,
    country,
    longitude: lon,
    latitude: lat,
  };
};

export default fetchLocation;
