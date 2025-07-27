document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const statusMessage = document.getElementById('status-message');
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const dateInput = document.getElementById('date');
    const bookingNumberInput = document.getElementById('bookingNumber');

    // Disable past dates and set min to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Generate unique booking number
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

            // EmailJS configuration
            const serviceID = 'service_mz1vacl';
            const adminTemplateID = 'template_ix6rrob';
            const userTemplateID = 'template_7hudvzs';

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            statusMessage.textContent = 'Processing your request...';
            statusMessage.className = 'mt-4 text-center text-blue-600';

            Promise.all([
                emailjs.sendForm(serviceID, adminTemplateID, this),
                emailjs.sendForm(serviceID, userTemplateID, this)
            ])
            .then(() => {
                statusMessage.textContent = 'Booking request sent! A confirmation has been sent to your email.';
                statusMessage.className = 'mt-4 text-center text-green-600 font-bold';
                bookingForm.reset();
                
                // Re-generate booking number after reset
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
