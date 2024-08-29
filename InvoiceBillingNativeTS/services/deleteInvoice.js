const { default: db } = require("../firebase");
import { doc, deleteDoc } from "firebase/firestore";

// Function to delete an invoice from Firestore
export async function deleteInvoice(invoiceId) {
  try {
    await deleteDoc(doc(db, "invoices", invoiceId));
    console.log("Document successfully deleted with ID: ", invoiceId);
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
}

// Usage example:
// try {
//   await deleteInvoice("abc123");
//   // Handle successful deletion (e.g., update UI, show success message)
// } catch (error) {
//   // Handle error (e.g., show error message to user)
// }
