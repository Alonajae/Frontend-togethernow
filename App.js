import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import VideoScreen from './Screens/VideoScreen';
import MapScreen from './Screens/MapScreen';
import TakepictureScreen from './Screens/TakepictureScreen';
import MyprofileScreen from './Screens/MyprofileScreen';
import ChatScreen from './Screens/ChatScreen';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import user from './reducers/user';
import map from './reducers/map';

import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";


const persistConfig = {
  key: 'TogetherNow',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  user,
  map,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    Jomhuria: require("./assets/fonts/Jomhuria-Regular.ttf"),
    Inter: require("./assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="TakePicture" component={TakepictureScreen} />
            <Stack.Screen name="Video" component={VideoScreen} />
            <Stack.Screen name="MyProfile" component={MyprofileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider >
  );
}
