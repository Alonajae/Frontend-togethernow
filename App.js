import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import IdentityScreen from './Screens/IdentityScreen';
import MapScreen from './Screens/MapScreen';
import TakePictureScreen from './Screens/TakePictureScreen';
import MyProfileScreen from './Screens/MyProfileScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

const persistConfig = {
  key: 'TogetherNow',
  storage,
};

const persistedReducer = persistReducer(persistConfig, user);

const reducers = combineReducers({
  user: persistedReducer,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="TakePicture" component={TakePictureScreen} />
            <Stack.Screen name="Identity" component={IdentityScreen} />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

//com 