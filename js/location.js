// js/location.js

async function getUserLocation() {
  // Try browser GPS first (most accurate)
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Reverse geocode to get city name from coordinates
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse`
            + `?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();

          resolve({
            city: data.address.city
                || data.address.town
                || data.address.municipality
                || "Your Location",
            country: data.address.country,
            countryCode: data.address.country_code.toLowerCase(),
            lat,
            lon
          });
        },
        async () => {
          // GPS denied — fall back to IP
          resolve(await getLocationByIP());
        }
      );
    });
  } else {
    return await getLocationByIP();
  }
}

// Fallback: IP-based location (city-level only)
async function getLocationByIP() {
  try {
    const res = await fetch("http://ip-api.com/json/");
    const data = await res.json();
    if (data.status === "success") {
      return {
        city: data.city,
        country: data.country,
        countryCode: data.countryCode.toLowerCase(),
        lat: data.lat,
        lon: data.lon
      };
    }
    throw new Error("IP location failed");
  } catch {
    return {
      city: "Cagayan de Oro",
      country: "Philippines",
      countryCode: "ph",
      lat: 8.4542,
      lon: 124.6319
    };
  }
}