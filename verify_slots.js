const API_URL = 'http://localhost:5000/api';
let token = '';

async function run() {
    try {
        // 1. Login as Admin
        console.log("Logging in...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        if (!loginRes.ok) throw new Error("Login failed");
        const loginData = await loginRes.json();
        token = loginData.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log("Logged in.");

        // 2. Create Service
        console.log("Creating Service...");
        const serviceRes = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title: 'Test Service',
                description: 'Test Desc',
                image: 'img.jpg'
            })
        });
        const serviceData = await serviceRes.json();
        const serviceId = serviceData.id;
        console.log("Service ID:", serviceId);

        // 3. Create SubService with Dynamic Slots
        console.log("Creating SubService with slots ['10:00', '12:00']...");
        const subRes = await fetch(`${API_URL}/services/${serviceId}/sub`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title: 'Test Sub',
                description: 'Desc',
                price: 50,
                duration: 60,
                availableSlots: ["10:00", "12:00"]
            })
        });
        const subData = await subRes.json();
        const subId = subData.id;
        console.log("SubService ID:", subId);

        // 4. Check available slots
        console.log("Fetching slots for today...");
        const date = new Date().toISOString().split('T')[0];
        const slotsRes = await fetch(`${API_URL}/bookings/slots?date=${date}&subServiceId=${subId}`);
        const slotsData = await slotsRes.json();
        console.log("Slots (Initial):", slotsData.map(s => s.time));

        if (slotsData.length !== 2) throw new Error("Should have 2 slots");

        // 5. Book the 10:00 slot
        console.log("Booking 10:00 slot...");
        const bookRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '1234567890',
                subServiceId: subId,
                date: date,
                time: '10:00'
            })
        });
        if (!bookRes.ok) {
            const err = await bookRes.json();
            throw new Error("Booking failed: " + JSON.stringify(err));
        }
        console.log("Booked.");

        // 6. Check available slots again
        console.log("Fetching slots after booking...");
        const slotsRes2 = await fetch(`${API_URL}/bookings/slots?date=${date}&subServiceId=${subId}`);
        const slotsData2 = await slotsRes2.json();
        console.log("Slots (After Booking):", slotsData2.map(s => s.time));

        const availableTimes = slotsData2.filter(s => s.available).map(s => s.time);

        // My Logic: if booked, it is NOT returned in the list (because I filter !isBooked).
        // Wait, let's re-read my controller implementation.
        // if (!isBooked) { slots.push(...) }
        // So yes, it should be missing from the array entirely.

        const allTimes = slotsData2.map(s => s.time);
        if (allTimes.includes('10:00')) throw new Error("10:00 should be gone!");
        if (!allTimes.includes('12:00')) throw new Error("12:00 should be available!");

        console.log("SUCCESS: Dynamic slots working as expected!");

    } catch (error) {
        console.error("FAILED:", error);
    }
}

run();
