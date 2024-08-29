// converted the ionic NewFile code to native react

import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as AppGeneral from '../socialcalc/index.js';
import { File, Local } from '../Storage/LocalStorage';
import { DATA } from '../../app-data.js';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo icons

interface Props {
  file: string;
  updateSelectedFile: Function;
  store: Local;
  billType: number;
}

const NewFile: React.FC<Props> = (props) => {
  const [showAlertNewFileCreated, setShowAlertNewFileCreated] = useState(false);

  const newFile = () => {
    if (props.file !== "default") {
      const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
      const data = props.store._getFile(props.file);
      const file = new File(
        (data as any).created,
        new Date().toString(),
        content,
        props.file,
        props.billType
      );
      props.store._saveFile(file);
      props.updateSelectedFile(props.file);
    }
    const msc = DATA["home"][AppGeneral.getDeviceType()]["msc"];
    AppGeneral.viewFile("default", JSON.stringify(msc));
    props.updateSelectedFile("default");
    setShowAlertNewFileCreated(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center px-8 bg-gray-100"
    >
      <View className="bg-white p-8 rounded-2xl shadow-md">
        <Text className="text-xl font-bold mb-6 text-center text-blue-600">Create New File</Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg mb-4 flex items-center justify-center"
          onPress={newFile}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text className="text-white ml-2 font-semibold">New File</Text>
        </TouchableOpacity>
        {showAlertNewFileCreated && Alert.alert(
          "Alert Message",
          "New file created!",
          [{ text: "OK", onPress: () => setShowAlertNewFileCreated(false) }]
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewFile;

