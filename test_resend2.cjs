const { Resend } = require('resend');

async function test() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const { data, error } = await resend.emails.send({
    from: `VaultShop <support@app.vaultshop.io>`,
    to: ['test@test.com'], 
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
