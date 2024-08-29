import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addInvoice } from "../services/addInvoice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    billTo: {
      name: "",
      address: "",
      cityStateZip: "",
      phone: "",
    },
    from: {
      name: "",
      address: "",
      cityStateZip: "",
      phone: "",
    },
    description: "",
    amount: "",
    userId: user ? user.uid : "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: keyof InvoiceData, value: string | Date) => {
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    section: "billTo" | "from",
    name: keyof InvoiceData["billTo"],
    value: string
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
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
      console.log(JSON.stringify(invoice, null, 2));
      addInvoice(invoice)
        .then((res: any) => {
          console.log("Invoice created", res);
          Alert.alert("Success", "Invoice created! Check console for details.");
        })
        .catch((err: any) => {
          console.error("Error creating invoice", err);
          Alert.alert(
            "Error",
            "Error creating invoice. Check console for details."
          );
        });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6">
        CREATE INVOICE
      </Text>

      <View className="flex-row mb-4">
        <Text className="font-bold w-1/3">INVOICE #:</Text>
        <TextInput
          className="flex-1 border border-gray-300 rounded px-2 py-1"
          value={invoice.invoiceNumber}
          onChangeText={(value) => handleChange("invoiceNumber", value)}
          keyboardType="numeric"
        />
      </View>

      <View className="flex-row mb-4">
        <Text className="font-bold w-1/3">INVOICE DATE:</Text>
        <TouchableOpacity
          className="flex-1 border border-gray-300 rounded px-2 py-1"
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{invoice.invoiceDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={invoice.invoiceDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-2">BILL TO:</Text>
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="Name"
          value={invoice.billTo.name}
          onChangeText={(value) => handleNestedChange("billTo", "name", value)}
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="Street Address"
          value={invoice.billTo.address}
          onChangeText={(value) =>
            handleNestedChange("billTo", "address", value)
          }
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="City, State, Zip"
          value={invoice.billTo.cityStateZip}
          onChangeText={(value) =>
            handleNestedChange("billTo", "cityStateZip", value)
          }
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="Phone (10 digits)"
          value={invoice.billTo.phone}
          onChangeText={(value) => handleNestedChange("billTo", "phone", value)}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-2">FROM:</Text>
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="Name"
          value={invoice.from.name}
          onChangeText={(value) => handleNestedChange("from", "name", value)}
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="Street Address"
          value={invoice.from.address}
          onChangeText={(value) => handleNestedChange("from", "address", value)}
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1 mb-2"
          placeholder="City, State, Zip"
          value={invoice.from.cityStateZip}
          onChangeText={(value) =>
            handleNestedChange("from", "cityStateZip", value)
          }
        />
        <TextInput
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="Phone (10 digits)"
          value={invoice.from.phone}
          onChangeText={(value) => handleNestedChange("from", "phone", value)}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View className="flex-row mb-4">
        <Text className="font-bold w-1/3">Description:</Text>
        <TextInput
          className="flex-1 border border-gray-300 rounded px-2 py-1"
          value={invoice.description}
          onChangeText={(value) => handleChange("description", value)}
        />
      </View>

      <View className="flex-row mb-6">
        <Text className="font-bold w-1/3">Amount:</Text>
        <TextInput
          className="flex-1 border border-gray-300 rounded px-2 py-1"
          value={invoice.amount}
          onChangeText={(value) => handleChange("amount", value)}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-md items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold">Create Invoice</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateInvoiceScreen;
