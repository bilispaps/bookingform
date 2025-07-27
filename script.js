document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const statusMessage = document.getElementById('status-message');
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const dateInput = document.getElementById('date');
    const bookingNumberInput = document.getElementById('bookingNumber');

    // Set minimum date to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDate;
    
    // Generate booking number
    function generateBookingNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `BILIS-${timestamp}-${randomNum}`;
    }
    
    // Initialize booking number
    bookingNumberInput.value = generateBookingNumber();
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Update booking number for this submission
            bookingNumberInput.value = generateBookingNumber();
            
            const serviceID = 'service_mz1vacl';
            const adminTemplateID = 'template_ix6rrob';
            const userTemplateID = 'template_7hudvzs';
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            statusMessage.textContent = 'Processing your request...';
            statusMessage.className = 'mt-4 text-center text-blue-600';
            
            // Prepare email parameters
            const templateParams = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobilenumber: document.getElementById('mobilenumber').value,
                pickupPoint: document.getElementById('pickupPoint').value,
                deliverypoint: document.getElementById('deliverypoint').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                message: document.getElementById('message').value,
                bookingNumber: bookingNumberInput.value
            };
            
            // Send emails
            Promise.all([
                emailjs.send(serviceID, adminTemplateID, templateParams),
                emailjs.send(serviceID, userTemplateID, templateParams)
            ])
            .then(() => {
                statusMessage.textContent = 'Booking request sent! A confirmation has been sent to your email.';
                statusMessage.className = 'mt-4 text-center text-green-600 font-bold';
                bookingForm.reset();
                
                // Reset date to tomorrow
                const newTomorrow = new Date();
                newTomorrow.setDate(newTomorrow.getDate() + 1);
                dateInput.min = newTomorrow.toISOString().split('T')[0];
                
                // Generate new booking number
                bookingNumberInput.value = generateBookingNumber();
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
                statusMessage.textContent = 'Error: Could not send booking request. Please try again later.';
                statusMessage.className = 'mt-4 text-center text-red-600 font-bold';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Booking';
            });
        });
    }
});
