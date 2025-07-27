document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const statusMessage = document.getElementById('status-message');
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const dateInput = document.getElementById('date');
    const bookingNumberInput = document.getElementById('bookingNumber');

    // Set minimum date to tomorrow (disable past dates)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);

    // Function to generate booking number
    function generateBookingNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `BILIS-${timestamp}-${randomNum}`;
    }

    // Initialize booking number
    bookingNumberInput.value = generateBookingNumber();

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Regenerate booking number for each submission
            bookingNumberInput.value = generateBookingNumber();

            const serviceID = 'service_mz1vacl';
            const adminTemplateID = 'template_ix6rrob';
            const userTemplateID = 'template_7hudvzs';

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            statusMessage.textContent = 'Processing your request...';
            statusMessage.className = 'mt-4 text-center text-blue-600';

            // Add booking number to form data
            const formData = new FormData(this);
            formData.append('bookingNumber', bookingNumberInput.value);

            Promise.all([
                emailjs.send(serviceID, adminTemplateID, Object.fromEntries(formData)),
                emailjs.send(serviceID, userTemplateID, Object.fromEntries(formData))
            ])
            .then(() => {
                statusMessage.textContent = 'Booking request sent! A confirmation has been sent to your email.';
                statusMessage.className = 'mt-4 text-center text-green-600 font-bold';
                bookingForm.reset();
                
                // Reset date to tomorrow after form submission
                dateInput.min = minDate;
                
                // Generate new booking number for next submission
                bookingNumberInput.value = generateBookingNumber();
            })
            .catch((err) => {
                console.error('Error:', err);
                statusMessage.textContent = 'An error occurred. Please check your details and try again.';
                statusMessage.className = 'mt-4 text-center text-red-600 font-bold';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Booking';
            });
        });
    }
});
