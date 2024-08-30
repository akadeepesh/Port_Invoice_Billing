import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { NavigationProps } from "../types/navigation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Feather } from "@expo/vector-icons";
import { app } from "../firebase";

type Props = {
  isLogin: boolean;
  navigation: NavigationProps;
};

const AuthForm: React.FC<Props> = ({ isLogin, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        })
        .finally(() => setIsLoading(false));
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          Alert.alert("Success", "Account created successfully");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToOtherForm = () => {
    navigation.navigate(isLogin ? "Signup" : "Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center px-6 bg-gray-50"
    >
      <View className="bg-white p-8 rounded-3xl shadow-lg">
        <Image
          source={require("../assets/favicon.png")}
          className="w-24 h-24 mx-auto mb-6"
        />
        <Text className="text-3xl font-bold mb-8 text-center text-blue-600">
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>
        <View className="mb-4">
          <Text className="text-gray-600 mb-2 ml-1">Email</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Feather name="mail" size={20} color="#4B5563" />
            <TextInput
              className="flex-1 ml-3"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View className="mb-6">
          <Text className="text-gray-600 mb-2 ml-1">Password</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Feather name="lock" size={20} color="#4B5563" />
            <TextInput
              className="flex-1 ml-3"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-lg mb-4"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              {isLogin ? "Login" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        <TouchableOpacity
          className="bg-white border border-gray-300 py-4 rounded-lg mb-6 flex-row justify-center items-center"
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Image
            source={require("../assets/Google_Icons-09-512.webp")}
            className="w-8 h-8 mr-3"
          />
          <Text className="text-gray-700 font-semibold text-lg">
            Continue with Google
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
