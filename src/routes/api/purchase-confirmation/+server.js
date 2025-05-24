import {json} from "@sveltejs/kit";
import sgMail from "@sendgrid/mail";
import { SENGRID_API_KEY } from "$env/static/private";

//in order for us to be able to send the message, we need to use sengrid API key; so we nne to set APiKey: 
sgMail.setApiKey(SENGRID_API_KEY);

//we need to send ebbok as pdf:, and we nneed to add this as an attrachment in our message; 
const PDF_GUIDE_URL = "https://narrify-public.s3.eu-central-1.amazonaws.com/sample.pdf";

export async function  POST({request}){
  const requestBody = await request.json();
  console.log(requestBody);

  //our file
const response = await fetch (PDF_GUIDE_URL); //we fetch the data here as a binary
const pdfBuffer = await response.arrayBuffer();
const base64Pdf = Buffer.from(pdfBuffer).toString("base64"); //, and then we turn it into base64


  // we extract the customer information, this is in our requestBody; 
  const customerEmail = requestBody.data.object.customer_details.email;
  const customerName = requestBody.data.object.customer_details.name;

  const message={
    to: customerEmail,
    from: "barbarka87@gmail.com",
    subject: "Your Purchase Confirmation - Complete Spain Relocation Guide",
    html :`
    <h1>Thank You for Your purchase</h1>
    <p>Dear ${customerName},</p>
    <p>We appreacite your purchase of the <strong>Complete Spain Relocation Guide</strong></p>.`,

    attachments: [
      {
        //content what Singrid is expecting is base64 Url, strind representation of that pdf;
        content:base64Pdf,
        filename: "Digital Ebook.pdf",
        type: "application/pdf",
        disposition: "attachment"

      }
    ]

  };

  await sgMail.send(message);


  return json({response: "Email sent"});
}