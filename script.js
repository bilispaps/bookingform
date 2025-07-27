document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const statusMessage = document.getElementById('status-message');
    const submitButton = bookingForm.querySelector('button[type="submit"]');

    // Ensure the form exists before adding an event listener
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            // --- Your EmailJS Credentials ---
            const serviceID = 'service_mz1vacl';
            // Replace with the template IDs you created in Step 1
            const adminTemplateID = 'template_ix6rrob'; // Your template for admin notifications
            const userTemplateID = 'template_7hudvzs'; // Your new template for user confirmation

            // Disable button and show sending status to prevent multiple clicks
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            statusMessage.textContent = 'Processing your request...';
            statusMessage.className = 'mt-4 text-center text-blue-600';

            // Create promises for sending each email
            const sendAdminEmail = emailjs.sendForm(serviceID, adminTemplateID, this);
            const sendUserEmail = emailjs.sendForm(serviceID, userTemplateID, this);

            // Use Promise.all to wait for both emails to be sent
            Promise.all([sendAdminEmail, sendUserEmail])
                .then((responses) => {
                    console.log('SUCCESS!', responses[0].status, responses[0].text);
                    statusMessage.textContent = 'Booking request sent! A confirmation has been sent to your email.';
                    statusMessage.className = 'mt-4 text-center text-green-600 font-bold';
                    bookingForm.reset(); // Clear the form fields after successful submission
                })
                .catch((err) => {
                    console.error('FAILED...', err);
                    statusMessage.textContent = 'An error occurred. Please check your details and try again.';
                    statusMessage.className = 'mt-4 text-center text-red-600 font-bold';
                })
                .finally(() => {
                    // Re-enable the button whether the submission succeeded or failed
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Booking';
                });
        });
    }
});
