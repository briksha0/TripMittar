import React, { useEffect, useRef } from "react";

export default function AutocompleteInput({
  placeholder,
  onPlaceSelected,
  defaultValue = "",
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    // Initialize Google Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"], // or ['(cities)'] if you only want cities
        fields: ["place_id", "formatted_address", "geometry", "name"],
      }
    );

    // Listener for place selection
    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (onPlaceSelected) {
        onPlaceSelected(place);
      }
    });

    return () => {
      if (listener) window.google.maps.event.removeListener(listener);
    };
  }, [onPlaceSelected]);

  // Update input value if defaultValue changes (e.g., when navigating back)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="bg-white dark:bg-gray-800 w-full p-3 border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
/>
  );
}
