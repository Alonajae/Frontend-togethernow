import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import IdentityScreen from './Screens/IdentityScreen';
import MapScreen from './Screens/MapScreen';
import TakePictureScreen from './Screens/TakePictureScreen';
import { Provider } from 'react-redux';
import { PersistConfig } from 'redux-persist';
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
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const store = configureStore({
  reducer: reducers,
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
