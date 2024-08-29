import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-12">
        <Text className="text-3xl font-bold text-gray-800 mb-8">Invoicer</Text>

        <TouchableOpacity
          className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden"
          onPress={() => navigation.navigate("CreateInvoice")}
        >
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-3 rounded-full mr-4">
                <Feather name="plus-circle" size={24} color="#3b82f6" />
              </View>
              <Text className="text-xl font-semibold text-gray-800">
                Create Invoice
              </Text>
            </View>
            <Text className="text-gray-600">
              Generate a new invoice quickly and easily
            </Text>
          </View>
          <View className="bg-blue-500 py-3 px-6">
            <Text className="text-white font-semibold text-right">
              Get Started →
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl shadow-md overflow-hidden"
          onPress={() => navigation.navigate("InvoiceList")}
        >
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 p-3 rounded-full mr-4">
                <Feather name="list" size={24} color="#10b981" />
              </View>
              <Text className="text-xl font-semibold text-gray-800">
                View Invoices
              </Text>
            </View>
            <Text className="text-gray-600">
              Access and manage your existing invoices
            </Text>
          </View>
          <View className="bg-green-500 py-3 px-6">
            <Text className="text-white font-semibold text-right">
              Explore →
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="bg-gray-100 py-4 px-6">
        <Text className="text-center text-gray-500">© 2024 DeCoders</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
