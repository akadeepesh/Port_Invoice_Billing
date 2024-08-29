import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { addInvoice } from "../services/addInvoice";
import { getAuth } from "firebase/auth";

type CreateInvoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateInvoice"
>;

type Props = {
  navigation: CreateInvoiceScreenNavigationProp;
};

type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
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
  description: string;
  amount: string;
  userId: string;
};

const CreateInvoiceScreen: React.FC<Props> = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "1",
    invoiceDate: new Date(),
    billTo: { name: "", address: "", cityStateZip: "", phone: "" },
    from: { name: "", address: "", cityStateZip: "", phone: "" },
    description: "",
    amount: "",
    userId: user ? user.uid : "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: keyof InvoiceData, value: string | Date) => {
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    section: "billTo" | "from",
    name: keyof InvoiceData["billTo"],
    value: string
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("invoiceDate", selectedDate);
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    if (!invoice.invoiceNumber) {
      Alert.alert("Error", "Please enter an invoice number.");
      return false;
    }
    if (!validatePhoneNumber(invoice.billTo.phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit phone number for Bill To."
      );
      return false;
    }
    if (!validatePhoneNumber(invoice.from.phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit phone number for From."
      );
      return false;
    }
    if (!invoice.amount || isNaN(parseFloat(invoice.amount))) {
      Alert.alert("Error", "Please enter a valid amount.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addInvoice(invoice)
        .then((res: any) => {
          console.log("Invoice created", res);
          Alert.alert("Success", "Invoice created successfully!");
          navigation.goBack();
        })
        .catch((err: any) => {
          console.error("Error creating invoice", err);
          Alert.alert("Error", "Failed to create invoice. Please try again.");
        });
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: any = "default"
  ) => (
    <View className="mb-4">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          Create Invoice
        </Text>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          {renderInput(
            "Invoice Number",
            invoice.invoiceNumber,
            (value) => handleChange("invoiceNumber", value),
            "Enter invoice number",
            "numeric"
          )}

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Invoice Date</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{invoice.invoiceDate.toLocaleDateString()}</Text>
              <Feather name="calendar" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={invoice.invoiceDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Bill To
          </Text>
          {renderInput(
            "Name",
            invoice.billTo.name,
            (value) => handleNestedChange("billTo", "name", value),
            "Enter name"
          )}
          {renderInput(
            "Address",
            invoice.billTo.address,
            (value) => handleNestedChange("billTo", "address", value),
            "Enter address"
          )}
          {renderInput(
            "City, State, Zip",
            invoice.billTo.cityStateZip,
            (value) => handleNestedChange("billTo", "cityStateZip", value),
            "Enter city, state, zip"
          )}
          {renderInput(
            "Phone",
            invoice.billTo.phone,
            (value) => handleNestedChange("billTo", "phone", value),
            "Enter 10-digit phone number",
            "phone-pad"
          )}
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">From</Text>
          {renderInput(
            "Name",
            invoice.from.name,
            (value) => handleNestedChange("from", "name", value),
            "Enter name"
          )}
          {renderInput(
            "Address",
            invoice.from.address,
            (value) => handleNestedChange("from", "address", value),
            "Enter address"
          )}
          {renderInput(
            "City, State, Zip",
            invoice.from.cityStateZip,
            (value) => handleNestedChange("from", "cityStateZip", value),
            "Enter city, state, zip"
          )}
          {renderInput(
            "Phone",
            invoice.from.phone,
            (value) => handleNestedChange("from", "phone", value),
            "Enter 10-digit phone number",
            "phone-pad"
          )}
        </View>

        <View className="bg-white rounded-xl shadow-md p-6 mb-6">
          {renderInput(
            "Description",
            invoice.description,
            (value) => handleChange("description", value),
            "Enter description"
          )}
          {renderInput(
            "Amount",
            invoice.amount,
            (value) => handleChange("amount", value),
            "Enter amount",
            "numeric"
          )}
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row justify-center items-center mb-12"
          onPress={handleSubmit}
        >
          <Feather
            name="check"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-lg">
            Create Invoice
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateInvoiceScreen;
