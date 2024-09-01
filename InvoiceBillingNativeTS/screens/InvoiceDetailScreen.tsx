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
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Feather } from "@expo/vector-icons";
import { getInvoiceById } from "../services/getInvoiceById";
import { deleteInvoice } from "../services/deleteInvoice";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { generateInvoicePDF } from "../functions/generateInvoicePdf";
import { sendInvoiceByEmail } from "../functions/sendInvoiceByEmail";

import { downloadInvoicePDF } from "../functions/downloadInvoicePDF";


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

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type InvoiceStatus = "paid" | "pending" | "overdue";

type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
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
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const invoiceData = await getInvoiceById(invoiceId);
      setInvoice(invoiceData as any);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError("Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string | any | FirebaseTimestamp) => {
    console.log(typeof date);
    if (typeof date === "string") {
      console.log("Converting string to date", date);
      return date;
    }

    if (typeof date === "object") {
      const object_date = new Date(date.seconds * 1000);
      return object_date.toLocaleDateString();
    }
    return date.toLocaleDateString();

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

  const handleDownloadOption = async (option: string) => {
    // Implement the logic for each download option
    console.log(`Selected option: ${option}`);
    if (option === "Print") {
      await downloadPdf(invoice as InvoiceData);
    } else if (option === "ShareInvoice") {
      await generateInvoicePDF(invoice as InvoiceData);

    } else if (option === "Download") {
      const filePath = await downloadInvoicePDF(invoice as InvoiceData);
      Alert.alert(
        "Success",
        `Your file has been successfully saved to: ${filePath}`
      );

    } else if (option === "Email") {
      await sendInvoiceByEmail(invoice as InvoiceData);
    }
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

  const formatAmount = (amount: number | string) => {
    return Number(amount).toFixed(2);
  };

  const handleDeleteInvoice = () => {
    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteInvoice(invoiceId);
              navigation.goBack();
            } catch (err) {
              console.error("Error deleting invoice:", err);
              Alert.alert("Error", "Failed to delete the invoice");
            }
          },
        },
      ]
    );
  };

  const handleUpdateInvoice = () => {
    navigation.navigate("UpdateInvoice", {
      invoiceId: invoice?.id,
    });
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
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(
              invoice.status
            )}`}
          >
            <Text className="text-white font-medium">{invoice.status}</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            Invoice #{invoice.invoiceNumber}
          </Text>
          <View className="relative">
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerWrapper: {
                    padding: 8,
                  },
                }}
              >
                <Feather name="more-vertical" size={24} color="#4B5563" />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    width: 200,
                    marginTop: 40,
                    right: 0,
                  },
                }}
              >
                <View className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <MenuOption onSelect={handleUpdateInvoice}>
                    <View className="flex-row items-center p-3">
                      <Feather name="edit" size={20} color="#EAB308" />
                      <Text className="ml-3 text-gray-800 font-semibold">
                        Update Invoice
                      </Text>
                    </View>
                  </MenuOption>
                  <View className="border-b border-gray-200" />
                  <MenuOption onSelect={handleDeleteInvoice}>
                    <View className="flex-row items-center p-3">
                      <Feather name="trash-2" size={20} color="#EF4444" />
                      <Text className="ml-3 text-gray-800 font-semibold">
                        Delete Invoice
                      </Text>
                    </View>
                  </MenuOption>
                </View>
              </MenuOptions>
            </Menu>
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
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Name :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.billTo.name}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Address :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.billTo.address}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">City, State, Zip :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.billTo.cityStateZip}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Phone :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.billTo.phone}
              </Text>
            </View>
          </>
        )}

        {renderSection(
          "From",
          <>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Name :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.from.name}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Address :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.from.address}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">City, State, Zip :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.from.cityStateZip}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Phone :</Text>
              <Text className="font-medium text-gray-800">
                {invoice.from.phone}
              </Text>
            </View>
          </>
        )}

        {renderSection(
          "Invoice Items",
          <>
            {invoice.items.map((item, index) => (
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
              className="bg-blue-500 py-4 px-6 rounded-xl mb-3 flex-row items-center shadow-md"
              onPress={() => handleDownloadOption("Print")}
            >
              <Feather
                name="send"
                size={24}
                color="white"
                style={{ marginRight: 16 }}
              />
              <Text className="text-lg font-semibold text-white">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity

              className="bg-green-500 py-4 px-6 rounded-xl mb-3 flex-row items-center shadow-md"
              onPress={() => handleDownloadOption("Download")}

            >
              <Feather
                name="download"
                size={24}
                color="white"
                style={{ marginRight: 16 }}
              />

              <Text className="text-lg font-semibold text-white">Download</Text>

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
