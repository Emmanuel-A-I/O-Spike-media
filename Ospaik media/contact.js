import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('contactFormMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value || 'General Inquiry',
            message: document.getElementById('message').value
        };

        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .insert([formData]);

            if (error) throw error;

            formMessage.textContent = 'Thank you for your message! We\'ll get back to you within 24 hours.';
            formMessage.className = 'form-message success';
            contactForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
            formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly.';
            formMessage.className = 'form-message error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}