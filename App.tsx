import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./src/Pages/Home";
import Modal from "./src/Pages/Modal";
import { NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Edit from "./src/Pages/Edit";

const Navigator = createStackNavigator();

export default function App() {
  useEffect(() => {
    const checkValidity = async () => {
      const value = await AsyncStorage.getItem("@presets");

      if (!value) {
        await AsyncStorage.setItem("@presets", JSON.stringify([]));
      }
    };
    checkValidity();
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Navigator.Navigator screenOptions={{ headerShown: false }}>
            <Navigator.Screen name="Home" component={Home} />
            <Navigator.Group screenOptions={{ presentation: "modal" }}>
              <Navigator.Screen name="Add / Send" component={Modal} />
            </Navigator.Group>
            <Navigator.Group
              screenOptions={{
                headerShown: true,
                presentation: "card",
                headerStyle: { backgroundColor: "#0f151c" },
                headerTitleStyle: { color: "#fff" },
                headerBackTitleStyle: { color: "#fff" },
                headerTintColor: "#fff",
              }}
            >
              <Navigator.Screen name="Edit Preset" component={Edit} />
            </Navigator.Group>
          </Navigator.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
