// src/components/Map/LocationSearch.jsx
import React, { useEffect, useRef } from "react";

export default function LocationSearch({
  onSelect,
  defaultValue = "",
  placeholder = "Enter location",
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    let autocomplete;

    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !inputRef.current) return;

      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"], // change to ["(cities)"] if you want only cities
        componentRestrictions: { country: "in" }, // restrict to India
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onSelect({
            name: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    };

    // ✅ If Google Maps already loaded → init immediately
    if (window.google && window.google.maps) {
      initAutocomplete();
    } else {
      // ✅ Retry until script is loaded
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          initAutocomplete();
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-transparent focus:outline-none"
    />
  );
}
