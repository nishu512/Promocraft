import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const LIBRARIES = ["places"];

const containerStyle = {
  width: "100%",
  height: "500px",
};

// fallback center in case hoardings are not loaded yet
const fallbackCenter = {
  lat: 18.96,
  lng: 72.83,
};

const Location = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBKhGnGwljJ5LpOrAvbv1zTLSns2VaCnag",
    libraries: LIBRARIES,
  });

  const [hoardings, setHoardings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState(fallbackCenter);

  useEffect(() => {
    const fetchHoardings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/hording/all");
        const userId = localStorage.getItem("id");

        const userHoardings = res.data.data.filter(
          (h) => h.userId && h.userId._id === userId
        );

        setHoardings(userHoardings);

        // Calculate average lat/lng to center the map
        if (userHoardings.length > 0) {
          const latSum = userHoardings.reduce(
            (sum, h) => sum + parseFloat(h.latitude),
            0
          );
          const lngSum = userHoardings.reduce(
            (sum, h) => sum + parseFloat(h.longitude),
            0
          );
          setMapCenter({
            lat: latSum / userHoardings.length,
            lng: lngSum / userHoardings.length,
          });
        }
      } catch (err) {
        console.error("Error fetching hoardings:", err);
      }
    };

    fetchHoardings();
  }, []);

  if (loadError) return <div>Map load error</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Hoardings</h2>

      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
        {hoardings.map((hoarding) => {
          const lat = parseFloat(hoarding.latitude);
          const lng = parseFloat(hoarding.longitude);
          return (
            <Marker
              key={hoarding._id}
              position={{ lat, lng }}
              onClick={() => setSelected(hoarding)}
            />
          );
        })}

        {selected && (
          <InfoWindow
            position={{
              lat: parseFloat(selected.latitude),
              lng: parseFloat(selected.longitude),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <strong>{selected.hoardingType}</strong>
              <p>₹{selected.hourlyRate}/hr</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Details Below the Map */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">All Your Hoarding Details:</h3>
        {hoardings.length === 0 ? (
          <p>No hoardings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hoardings.map((h) => (
              <div
                key={h._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <p><strong>Type:</strong> {h.hoardingType}</p>
                <p><strong>Hourly Rate:</strong> ₹{h.hourlyRate}</p>
                <p><strong>Location:</strong> Lat {h.latitude}, Lng {h.longitude}</p>
                {h.size && <p><strong>Size:</strong> {h.size}</p>}
                {typeof h.available === "boolean" && (
                  <p><strong>Available:</strong> {h.available ? "Yes" : "No"}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;
