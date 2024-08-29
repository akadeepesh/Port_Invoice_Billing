const { default: db } = require("../firebase");
import { doc, updateDoc } from "firebase/firestore";

// Function to update an invoice in Firestore
export async function updateInvoice(invoiceId, updateData) {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId);
    await updateDoc(invoiceRef, updateData);
    console.log("Document successfully updated with ID: ", invoiceId);
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}

// Usage example:
// try {
//   const updatedData = {
//     amount: 1500,
//     status: "paid",
//     // ... other fields to update
//   };
//   await updateInvoice("abc123", updatedData);
//   // Handle successful update (e.g., update UI, show success message)
// } catch (error) {
//   // Handle error (e.g., show error message to user)
// }
