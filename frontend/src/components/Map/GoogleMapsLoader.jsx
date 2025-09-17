import { useEffect } from "react";

const GoogleMapsLoader = () => {
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return null; // no UI, just loads the script
};

export default GoogleMapsLoader;
