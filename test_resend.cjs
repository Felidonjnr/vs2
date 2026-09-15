const { Resend } = require('resend');

async function test() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  console.log("Attempting to send from:", `VaultShop <${fromEmail}>`);
  
  const { data, error } = await resend.emails.send({
    from: `VaultShop <${fromEmail}>`,
    to: ['godshandudoh@gmail.com'], // using the user's email from metadata
    subject: 'Test Email',
    html: '<p>Test</p>'
  });

  if (error) {
    console.error("Failed:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success:", data);
  }
}
test();
