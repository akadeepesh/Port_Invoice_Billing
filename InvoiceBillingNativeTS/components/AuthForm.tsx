import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NavigationProps } from "../types/navigation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { app } from "../firebase";

type Props = {
  isLogin: boolean;
  navigation: NavigationProps;
};

const AuthForm: React.FC<Props> = ({ isLogin, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);

  const handleSubmit = async () => {
    console.log(isLogin ? "Logging in" : "Signing up", { email, password });

    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Signed in
          navigation.goBack();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Alert.alert("Error", errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Signed up
          Alert.alert("Success", "Account created successfully");
        })
        .catch((error) => {
          const errorMessage = error.message;

          Alert.alert("Error", errorMessage);
        });
    }
  };

  const navigateToOtherForm = () => {
    navigation.navigate(isLogin ? "Signup" : "Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center px-8 bg-gray-100"
    >
      <View className="bg-white p-8 rounded-2xl shadow-md">
        <Text className="text-3xl font-bold mb-6 text-center text-blue-600">
          {isLogin ? "Login" : "Sign Up"}
        </Text>
        <TextInput
          className="bg-gray-100 px-4 py-2 rounded-lg mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-100 px-4 py-2 rounded-lg mb-6"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">
            {isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToOtherForm}>
          <Text className="text-blue-500 text-center">
            {isLogin
              ? "Don't have an account? Sign up here"
              : "Already have an account? Login here"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthForm;
