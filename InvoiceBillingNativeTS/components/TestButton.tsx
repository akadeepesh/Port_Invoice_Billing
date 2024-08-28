import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface TestButtonProps {
  onPress: () => void;
  title: string;
}

const TestButton: React.FC<TestButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-blue-500 py-2 px-4 rounded-lg shadow-md active:bg-blue-600"
    >
      <Text className="text-white font-bold text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default TestButton;
