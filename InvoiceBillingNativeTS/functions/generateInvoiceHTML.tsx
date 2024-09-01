type InvoiceItem = {
  id: string;
  description: string;
  amount: string;
};
type InvoiceStatus = "paid" | "pending" | "overdue";

type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
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
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  userId: string;
  status: InvoiceStatus;
};
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const formatDate = (date: Date | string | any | FirebaseTimestamp) => {
    if (typeof date === "string") {
      return date;
    }
    if (typeof date === "object" && "seconds" in date) {
      const object_date = new Date(date.seconds * 1000);
      return object_date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${data.invoiceNumber}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .invoice-container {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
        }
        .logo {
            width: 50px;
            height: 50px;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: #888;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h1 {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin: 0;
            text-transform: uppercase;
        }
        .invoice-number {
            font-size: 16px;
            color: #666;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-details > div {
            flex-basis: 48%;
        }
        .label {
            font-weight: 500;
            color: #666;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        th {
            background-color: #f8f9fa;
            font-weight: 500;
            color: #333;
            text-transform: uppercase;
        }
        .text-right {
            text-align: right;
        }
        .total-section {
            margin-top: 30px;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .total {
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .status {
            font-weight: 500;
            text-transform: uppercase;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            display: inline-block;
            margin-top: 10px;
        }
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-overdue {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <img class="logo" src="https://i.imgur.com/0s5RNtl.png" alt="DeCoders">
            <div class="invoice-title">
                <h1>Tax Invoice</h1>
                <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
            </div>
        </div>
        
        <div class="invoice-details">
            <div>
                <p class="label">Invoice To:</p>
                <p><strong>Name : </strong>${data.billTo.name}</p>
                <p><strong>Address : </strong>${data.billTo.address}, ${
    data.billTo.cityStateZip
  }</p>
                <p><strong>Phone Number : </strong>${data.billTo.phone}</p>
            </div>
            <div>
                <p class="label">Invoice From:</p>
                <p><strong>Name : </strong>${data.from.name}</p>
                <p><strong>Address : </strong>${data.from.address}, ${
    data.from.cityStateZip
  }</p>
                <p><strong>Phone Number : </strong>${data.from.phone}</p>
            </div>
        </div>
        
        <div class="invoice-details">
            <div>
                <p><span class="label">Invoice Date:</span> ${formatDate(
                  data.invoiceDate
                )}</p>
                <p><span class="label">Due Date:</span> ${formatDate(
                  data.dueDate
                )}</p>
            </div>
            <div>
                <p><span class="label">Status:</span> <span class="status status-${
                  data.status
                }">${data.status}</span></p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Description</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.items
                  .map(
                    (item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.description}</td>
                        <td class="text-right">₹${item.amount}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${data.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>GST:</span>
                <span>₹${data.gstAmount.toFixed(2)}</span>
            </div>
            <div class="total-row total">
                <span>Total:</span>
                <span>₹${data.totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};
