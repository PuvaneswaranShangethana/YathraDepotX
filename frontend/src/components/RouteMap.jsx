import {
  GoogleMap,
  Marker,
  LoadScript
} from '@react-google-maps/api'

function RouteMap({ startPoint, endPoint }) {
  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px'
  }

  const center = {
    lat: 7.8731,
    lng: 80.7718
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/${startPoint}/${endPoint}`
    window.open(url, '_blank')
  }

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyBNePyeACZuDODVZQDlEU-Cc9QYtH7Oq_M">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
        >
          <Marker position={center} label="SL" />
        </GoogleMap>
      </LoadScript>

      <button
        className="btn btn-outline-primary mt-3"
        onClick={openGoogleMaps}
      >
        Open Route in Google Maps
      </button>
    </div>
  )
}

export default RouteMap