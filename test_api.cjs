async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/send-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", orderId: "VC-TEST", productName: "Test", status: "completed" })
    });
    const data = await res.json();
    console.log("Status:", res.status, data);
  } catch(e) {
    console.error(e);
  }
}
test();
