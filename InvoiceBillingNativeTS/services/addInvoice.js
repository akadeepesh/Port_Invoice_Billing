const { default: db } = require("../firebase");
import { addDoc, collection } from "firebase/firestore";

// Function to add an invoice to Firestore
export async function addInvoice(invoiceData) {
  try {
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding invoice:", error);
    throw error;
  }
}
