import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";
import { getInvoiceById } from "../services/getInvoiceById";

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

type InvoiceStatus = "paid" | "pending" | "overdue";

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  invoiceDate: FirebaseTimestamp;
  dueDate: FirebaseTimestamp;
  billTo: {
    name: string;
    address: string;
    cityStateZip: string;
    phone: string;
  };
  from: {
    name: string;
    address: string;
    cityStateZip: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  userId: string;
  status: InvoiceStatus;
};

const InvoiceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceData = await getInvoiceById(invoiceId);
        setInvoice(invoiceData as any);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to fetch invoice details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  // const formatDate = (date: Date | string) => {
  //   if (typeof date === "string") {
  //     return new Date(date).toLocaleDateString();
  //   }
  //   return date.toLocaleDateString();
  // };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const formatDate = (timestamp: FirebaseTimestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  const formatAmount = (amount: number | string) => {
    return Number(amount).toFixed(2);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error || !invoice) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-500">
          {error || "Invoice not found"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800">
            Invoice #{invoice.invoiceNumber}
          </Text>
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
                {formatDate(invoice.invoiceDate)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Due Date:</Text>
              <Text className="font-medium text-gray-800">
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
          </>
        )}

        {renderSection(
          "Bill To",
          <>
            <Text className="font-medium text-gray-800 mb-1">
              {invoice?.billTo?.name}
            </Text>
            <Text className="text-gray-600">{invoice?.billTo?.address}</Text>
            <Text className="text-gray-600">
              {invoice?.billTo?.cityStateZip}
            </Text>
            <Text className="text-gray-600 mt-2">
              Phone: {invoice?.billTo?.phone}
            </Text>
          </>
        )}

        {renderSection(
          "From",
          <>
            <Text className="font-medium text-gray-800 mb-1">
              {invoice?.from?.name}
            </Text>
            <Text className="text-gray-600">{invoice?.from?.address}</Text>
            <Text className="text-gray-600">{invoice?.from?.cityStateZip}</Text>
            <Text className="text-gray-600 mt-2">
              Phone: {invoice?.from?.phone}
            </Text>
          </>
        )}

        {renderSection(
          "Invoice Items",
          <>
            {invoice?.items?.map((item, index) => (
              <View
                key={item.id}
                className="flex-row justify-between mb-2 pb-2 border-b border-gray-200"
              >
                <Text className="text-gray-600">{item.description}</Text>
                <Text className="font-medium text-gray-800">
                  ${formatAmount(item.amount)}
                </Text>
              </View>
            ))}
            <View className="mt-4 pt-4 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                Subtotal
              </Text>
              <Text className="text-xl font-bold text-gray-800">
                ${formatAmount(invoice.subtotal)}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">GST</Text>
              <Text className="text-xl font-bold text-gray-800">
                ${formatAmount(invoice.gstAmount)}
              </Text>
            </View>
            <View className="mt-4 pt-4 border-t border-gray-200 flex-row justify-between items-center">
              <Text className="text-xl font-semibold text-gray-800">Total</Text>
              <Text className="text-2xl font-bold text-blue-600">
                ${formatAmount(invoice.totalAmount)}
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
              <Text className="text-lg font-semibold text-white">Email</Text>
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
