/**
 * GPS Live Location & Reverse Geocoding Utility for Cocoon Studio
 * Automatically captures customer's live geolocation and resolves detailed street/locality, city, state & pincode
 */

export async function captureLiveGpsAddress() {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          // 1. Primary Reverse Geocode: OpenStreetMap Nominatim with full addressdetails
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en"
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const a = data.address || {};

            const house = a.house_number || a.house_name || "";
            const road = a.road || a.pedestrian || a.street || "";
            const locality = a.suburb || a.neighbourhood || a.residential || a.quarter || a.village || a.subdistrict || "";
            const landmark = a.landmark || a.amenity || "";
            const district = a.city_district || a.county || a.state_district || "";

            const city =
              a.city ||
              a.town ||
              a.municipality ||
              a.city_district ||
              a.state_district ||
              "";

            const state = a.state || "";
            const pincode = a.postcode ? a.postcode.replace(/\D/g, "").slice(0, 6) : "";

            // Build detailed, rich street address (Colony, Sector, Road, Landmark)
            let detailedStreet = "";
            const specificParts = [house, road, locality, landmark].filter(Boolean);

            if (specificParts.length > 0) {
              detailedStreet = Array.from(new Set(specificParts)).join(", ");
            } else if (data.display_name) {
              const raw = data.display_name.split(",").map((s) => s.trim());
              const filtered = raw.filter(
                (p) =>
                  p.toLowerCase() !== "india" &&
                  p.toLowerCase() !== state.toLowerCase() &&
                  !/^\d{6}$/.test(p)
              );
              detailedStreet = filtered.slice(0, 3).join(", ");
            }

            // If street is still just the city name, pick top 2 items from display_name
            if ((!detailedStreet || detailedStreet.toLowerCase() === city.toLowerCase()) && data.display_name) {
              const raw = data.display_name.split(",").map((s) => s.trim());
              detailedStreet = raw.slice(0, 2).join(", ");
            }

            resolve({
              success: true,
              address: detailedStreet,
              fullDisplayAddress: detailedStreet,
              city: city || district,
              state,
              pincode,
              latitude,
              longitude,
              accuracy: Math.round(accuracy)
            });
            return;
          }
        } catch (osmErr) {
          console.warn("Nominatim lookup failed, attempting fallback...", osmErr);
        }

        // 2. Secondary Fallback: BigDataCloud Client Reverse Geocode
        try {
          const fallbackRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            const city = fbData.city || fbData.locality || "";
            const state = fbData.principalSubdivision || "";
            const pincode = fbData.postcode ? fbData.postcode.replace(/\D/g, "").slice(0, 6) : "";
            const locality = [fbData.locality, fbData.city].filter(Boolean).join(", ");

            resolve({
              success: true,
              address: locality,
              fullDisplayAddress: locality,
              city,
              state,
              pincode,
              latitude,
              longitude,
              accuracy: Math.round(accuracy)
            });
            return;
          }
        } catch (fallbackErr) {
          console.error("Secondary geocode failed:", fallbackErr);
        }

        // Fallback with coordinates if geocoders are unreachable
        resolve({
          success: true,
          address: "",
          fullDisplayAddress: "",
          city: "",
          state: "",
          pincode: "",
          latitude,
          longitude,
          accuracy: Math.round(accuracy)
        });
      },
      (error) => {
        let msg = "Could not fetch GPS location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please enter address manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS signal unavailable. Please ensure location is enabled.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Pincode to City/District lookup using official Postal Pincode API
 */
export async function lookupPincode(pincode) {
  const cleanPin = (pincode || "").toString().replace(/\D/g, "").slice(0, 6);
  if (cleanPin.length !== 6) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        return {
          success: true,
          city: po.District || po.Division || po.Block || "",
          state: po.State || "",
          district: po.District || "",
          locality: po.Name || ""
        };
      }
    }
  } catch (err) {
    console.warn("Pincode lookup error:", err);
  }
  return null;
}

