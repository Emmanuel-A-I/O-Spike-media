import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('bookingFormMessage');

if (bookingForm) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').setAttribute('min', today);

    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const formData = {
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value || null,
            event_type: document.getElementById('eventType').value,
            event_date: document.getElementById('eventDate').value,
            budget: document.getElementById('budget').value || null,
            message: document.getElementById('bookingMessage').value,
            status: 'pending'
        };

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([formData]);

            if (error) throw error;

            formMessage.textContent = 'Your booking request has been submitted successfully! We\'ll contact you within 24 hours to discuss your project.';
            formMessage.className = 'form-message success';
            bookingForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 7000);

        } catch (error) {
            console.error('Error submitting booking:', error);
            formMessage.textContent = 'Sorry, there was an error submitting your booking. Please try again or contact us directly at hello@ospaikmedia.com';
            formMessage.className = 'form-message error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Booking Request';
        }
    });
}