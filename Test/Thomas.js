const GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').default;

const handleSearch = (data, details) => {
  const lat = details.geometry.location.lat;
  const lng = details.geometry.location.lng;
  const name = details.name;
  const description = details.formatted_address;
  const coordinate = { latitude: lat, longitude: lng };
  const newSafePlace = { name, description, coordinate };
  setSafePlaces([...safePlaces, newSafePlace]);
  fetch(`https://backend-together-mvp.vercel.app/safeplaces/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
      name: name,
      description: description,
      coordinate: coordinate
    })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
}