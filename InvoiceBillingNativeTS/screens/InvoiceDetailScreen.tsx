import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";

type InvoiceDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "InvoiceDetail"
>;

type InvoiceDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "InvoiceDetail"
>;

type Props = {
  navigation: InvoiceDetailScreenNavigationProp;
  route: InvoiceDetailScreenRouteProp;
};

const InvoiceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { invoiceId } = route.params;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupAnimation] = useState(new Animated.Value(0));

  // Fetch invoice details based on invoiceId (replace with actual data from Firebase later)
  const invoice = {
    invoiceNumber: invoiceId,
    invoiceDate: "2024-05-15",
    dueDate: "2024-06-15",
    status: "Pending",
    billTo: {
      name: "John Doe",
      address: "123 Main St",
      cityStateZip: "Anytown, ST 12345",
      phone: "9999999999",
    },
    from: {
      name: "Your Company",
      address: "456 Business Ave",
      cityStateZip: "Cityville, ST 67890",
      phone: "1111111111",
    },
    items: [
      { description: "Web Development", amount: 2000 },
      { description: "UI/UX Design", amount: 500 },
    ],
    total: 2500,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleDownloadOption = (option: string) => {
    // Implement the logic for each download option
    console.log(`Selected option: ${option}`);
    hidePopup();
  };

  const showPopup = () => {
    setPopupVisible(true);
    Animated.timing(popupAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hidePopup = () => {
    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setPopupVisible(false));
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View className="bg-white rounded-xl shadow-md p-6 mb-6">
      <Text className="text-xl font-semibold text-gray-800 mb-4">{title}</Text>
      {content}
    </View>
  );

  const popupTranslateY = popupAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800">Invoice</Text>
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(
              invoice.status
            )}`}
          >
            <Text className="text-white font-medium">{invoice.status}</Text>
          </View>
        </View>

        {renderSection(
          "Invoice Details",
          <>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Invoice Number:</Text>
              <Text className="font-medium text-gray-800">
                {invoice.invoiceNumber}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Invoice Date:</Text>
              <Text className="font-medium text-gray-800">
                {invoice.invoiceDate}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Due Date:</Text>
              <Text className="font-medium text-gray-800">
                {invoice.dueDate}
              </Text>
            </View>
          </>
        )}

        {renderSection(
          "Bill To",
          <>
            <Text className="font-medium text-gray-800 mb-1">
              {invoice.billTo.name}
            </Text>
            <Text className="text-gray-600">{invoice.billTo.address}</Text>
            <Text className="text-gray-600">{invoice.billTo.cityStateZip}</Text>
            <Text className="text-gray-600 mt-2">
              Phone: {invoice.billTo.phone}
            </Text>
          </>
        )}

        {renderSection(
          "From",
          <>
            <Text className="font-medium text-gray-800 mb-1">
              {invoice.from.name}
            </Text>
            <Text className="text-gray-600">{invoice.from.address}</Text>
            <Text className="text-gray-600">{invoice.from.cityStateZip}</Text>
            <Text className="text-gray-600 mt-2">
              Phone: {invoice.from.phone}
            </Text>
          </>
        )}

        {renderSection(
          "Invoice Items",
          <>
            {invoice.items.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between mb-2 pb-2 border-b border-gray-200"
              >
                <Text className="text-gray-600">{item.description}</Text>
                <Text className="font-medium text-gray-800">
                  ${item.amount.toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="mt-4 pt-4 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Total</Text>
              <Text className="text-2xl font-bold text-blue-600">
                ${invoice.total.toFixed(2)}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      {!isPopupVisible && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          onPress={showPopup}
        >
          <Feather name="download" size={24} color="white" />
        </TouchableOpacity>
      )}

      {isPopupVisible && (
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          style={{
            transform: [{ translateY: popupTranslateY }],
          }}
        >
          <View className="p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Download Options
            </Text>
            <TouchableOpacity
              className="bg-green-500 py-4 px-6 rounded-xl mb-3 flex-row items-center shadow-md"
              onPress={() => handleDownloadOption("Print")}
            >
              <Feather
                name="printer"
                size={24}
                color="white"
                style={{ marginRight: 16 }}
              />
              <Text className="text-lg font-semibold text-white">Print</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 py-4 px-6 rounded-xl mb-3 flex-row items-center shadow-md"
              onPress={() => handleDownloadOption("Save to Cloud")}
            >
              <Feather
                name="cloud"
                size={24}
                color="white"
                style={{ marginRight: 16 }}
              />
              <Text className="text-lg font-semibold text-white">
                Save to Cloud
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-800 py-4 px-6 rounded-xl mb-3 flex-row items-center shadow-md"
              onPress={() => handleDownloadOption("Email")}
            >
              <Feather
                name="mail"
                size={24}
                color="white"
                style={{ marginRight: 16 }}
              />
              <Text className="text-lg font-semibold text-gray-100">Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-400 py-4 px-6 rounded-xl mt-2 shadow-md"
              onPress={hidePopup}
            >
              <Text className="text-lg text-center font-semibold text-white">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default InvoiceDetailScreen;
