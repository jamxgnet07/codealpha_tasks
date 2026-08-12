const bookingForm = document.getElementById("bookingForm");
const result = document.getElementById("result");
const loadBookingsBtn = document.getElementById("loadBookings");
const bookingsList = document.getElementById("bookingsList");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookingData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    passengers: document.getElementById("passengers").value,
    passType: document.getElementById("passType").value,
    journeyDate: document.getElementById("journeyDate").value
  };

  try {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    if (data.success) {
      const booking = data.booking;
      result.innerHTML = `
        <h3>Booking Confirmed</h3>
        <p><strong>Ticket No:</strong> ${booking.ticketNumber}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Route:</strong> ${booking.from} to ${booking.to}</p>
        <p><strong>Passengers:</strong> ${booking.passengers}</p>
        <p><strong>Pass Type:</strong> ${booking.passType}</p>
        <p><strong>Journey Date:</strong> ${booking.journeyDate}</p>
        <p><strong>Total Fare:</strong> ₹${booking.fare}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      `;
      bookingForm.reset();
    } else {
      result.innerHTML = `<p style="color:red;">${data.message}</p>`;
    }
  } catch (error) {
    result.innerHTML = `<p style="color:red;">Booking failed. Please try again.</p>`;
  }
});

loadBookingsBtn.addEventListener("click", async () => {
  bookingsList.innerHTML = "<p>Loading bookings...</p>";

  try {
    const response = await fetch("/api/bookings");
    const data = await response.json();

    if (data.success && data.bookings.length > 0) {
      bookingsList.innerHTML = data.bookings
        .slice()
        .reverse()
        .map(
          (booking) => `
          <div class="booking-item">
            <p><strong>Ticket:</strong> ${booking.ticketNumber}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Route:</strong> ${booking.from} to ${booking.to}</p>
            <p><strong>Passengers:</strong> ${booking.passengers}</p>
            <p><strong>Pass:</strong> ${booking.passType}</p>
            <p><strong>Fare:</strong> ₹${booking.fare}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
        `
        )
        .join("");
    } else {
      bookingsList.innerHTML = "<p>No bookings found.</p>";
    }
  } catch (error) {
    bookingsList.innerHTML = "<p>Failed to load bookings.</p>";
  }
});