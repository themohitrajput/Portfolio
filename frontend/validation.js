document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    
    // Function to validate form fields
    function validateFields() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(function(span) {
            span.style.display = 'none';
        });

        // Check each field for validity
        if (!name.value) {
            isValid = false;
            name.nextElementSibling.innerText = 'Name is required.';
            name.nextElementSibling.style.display = 'block';
        }

        if (!email.value) {
            isValid = false;
            email.nextElementSibling.innerText = 'Email is required.';
            email.nextElementSibling.style.display = 'block';
        } else {
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!emailPattern.test(email.value)) {
                isValid = false;
                email.nextElementSibling.innerText = 'Please enter a valid email address.';
                email.nextElementSibling.style.display = 'block';
            }
        }

        if (!subject.value) {
            isValid = false;
            subject.nextElementSibling.innerText = 'Subject is required.';
            subject.nextElementSibling.style.display = 'block';
        }

        if (!message.value) {
            isValid = false;
            message.nextElementSibling.innerText = 'Message is required.';
            message.nextElementSibling.style.display = 'block';
        }

        return isValid;
    }

    // Enable or disable the submit button based on form field validation
    form.addEventListener('input', function () {
        if (validateFields()) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });

    // Form submission event
    form.addEventListener('submit', async function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Validate fields before calling the API
        if (validateFields()) {
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
          };
          submitBtn.style.display = "none"; // Hide the button
          spinner.style.display = "inline-block";
          const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          if (response.ok) {
            spinner.style.display = "none"; // Hide the spinner
            submitBtn.style.display = "inline-block";
            form.reset();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Thank you for connecting with us! We will get back to you as soon as possible.',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to send message. Please try again.',
              confirmButtonText: 'Try Again'
            });
          }
        }
    });
});
