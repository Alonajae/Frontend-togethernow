    <GooglePlacesAutocomplete
      placeholder='Search' 
      onPress={(data, details = null) => {
      console.log(data, details);
      }}
      query={{
        key: 'YOUR API KEY',
        language: 'en',
      }}
    />
    