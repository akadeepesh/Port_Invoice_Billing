import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css";
import TestButton from "./components/TestButton";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl mb-4">
        Open up App.tsx to start working oyour app!
      </Text>
      <TestButton
        title="Test Button"
        onPress={() => console.log("Button pressed!")}
      />
      <StatusBar style="auto" />
    </View>
  );
}
