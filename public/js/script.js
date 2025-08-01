// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// for disappering of flash after 2 second
setTimeout(() => {
    const alert = document.getElementById('flash-alert');
    if (alert) {
      alert.classList.remove('show'); // Bootstrap fade out
      alert.classList.add('fade');
      setTimeout(() => alert.remove(), 500); // Fully remove from DOM after fade
    }
  }, 2500);
