import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <SplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
};

export default App;