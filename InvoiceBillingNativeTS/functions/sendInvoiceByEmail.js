import { generateInvoiceHTML } from "./generateInvoiceHTML";
import { getAuth } from "firebase/auth";
import emailjs from "@emailjs/react-native";
import { Alert } from "react-native";

export const sendInvoiceByEmail = async (invoiceData) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const auth = getAuth();
  const email = auth?.currentUser?.email;
  const userName = auth?.currentUser?.displayName;
  console.log(email);
  const html = generateInvoiceHTML(invoiceData);
  const templateParams = {
    from_name: "DeCoders",
    to_name: userName,
    reply_to: email,
    message: html,
  };

  console.log("templateId", templateId);
  console.log("serviceId", serviceId);
  console.log("publicKey", publicKey);

  emailjs
    .send(serviceId, templateId, templateParams, {
      publicKey: publicKey,
    })
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        Alert.alert("Email Sent Successfully");
      },
      (err) => {
        console.log("FAILED...", err);
        Alert.alert("Email Failed to Send");
      }
    );
};
