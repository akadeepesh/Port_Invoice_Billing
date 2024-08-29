const { default: db } = require("../firebase");
import { collection, query, where, getDocs } from "firebase/firestore";

// Function to get invoices by userId from Firestore
export async function getInvoicesByUserId(userId) {
  try {
    const invoicesRef = collection(db, "invoices");
    const q = query(invoicesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const invoices = [];
    querySnapshot.forEach((doc) => {
      invoices.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Retrieved ${invoices.length} invoices for user: ${userId}`);
    return invoices;
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw error;
  }
}

// Usage example:
// try {
//   const userInvoices = await getInvoicesByUserId("user123");
//   // Handle the retrieved invoices (e.g., update UI, display in a list)
// } catch (error) {
//   // Handle error (e.g., show error message to user)
// }
