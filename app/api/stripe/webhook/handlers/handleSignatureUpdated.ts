// const invoice = event.data.object as Stripe.Invoice;

//       const lineItem = invoice.lines.data.find(item => item.subscription);

//       if (lineItem && typeof lineItem.subscription === "string") {
//         subscriptionId = lineItem.subscription;
//       }

//       if (!subscriptionId) {
//         if ("subscription" in invoice && invoice.subscription) {
//           subscriptionId = invoice.subscription as string;
//         } else {
//           return {
//             ok: false,
//             error: "Ignorado: Invoice sem vinculo de assinatura",
//           };
//         }
//       }

//       userId = invoice.metadata?.userId || null;
//       planId = invoice.metadata?.planId || null;