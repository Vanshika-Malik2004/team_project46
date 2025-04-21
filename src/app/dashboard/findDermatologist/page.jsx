"use client";

import { useState, useEffect } from "react";

export default function FindDermatologistsPage() {
  const [dermatologists, setDermatologists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const findNearbyDermatologists = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const map = new window.google.maps.Map(document.createElement("div"));
      const service = new window.google.maps.places.PlacesService(map);

      const request = {
        location: new window.google.maps.LatLng(latitude, longitude),
        radius: "5000",
        keyword: "dermatologist",
        type: "doctor",
      };

      setLoading(true);
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setDermatologists(results);
        } else {
          console.error("PlacesService Status:", status);
        }
        setLoading(false);
      });
    });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Find Nearby Dermatologists 🧑‍⚕️</h1>

      <button
        onClick={findNearbyDermatologists}
        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Find Dermatologists
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {dermatologists.map((place) => (
          <div
            key={place.place_id}
            className="rounded border p-4 shadow transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{place.name}</h2>
            <p className="text-sm text-gray-600">{place.vicinity}</p>
            {place.rating && (
              <p className="mt-2 text-sm">Rating: {place.rating} ⭐</p>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-500 hover:underline"
            >
              View on Map
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
