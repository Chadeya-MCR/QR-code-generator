document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const textInput = document.getElementById('text');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  // Add event listeners
  textInput.addEventListener('keyup', handleEnterKey);
  generateBtn.addEventListener('click', generateQRCode);
  downloadBtn.addEventListener('click', downloadQRCode);
  resetBtn.addEventListener('click', resetForm);
});

/**
 * Handle Enter key press in the input field
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    generateQRCode();
  }
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  
  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}

/**
 * Generate QR code based on input and options
 */
function generateQRCode() {
  const container = document.getElementById('qrcode');
  const text = document.getElementById('text').value.trim();
  const errorLevel = document.getElementById('errorCorrection').value;
  const size = parseInt(document.getElementById('size').value);
  const generateBtn = document.getElementById('generateBtn');
  const spinner = document.getElementById('spinner');
  const resultCard = document.getElementById('resultCard');
  
  // Validate input
  if (!text) {
    showError('Please enter text or URL first');
    return;
  }
  
  // Show loading state
  generateBtn.disabled = true;
  spinner.classList.remove('hidden');
  container.innerHTML = '';
  
  // Generate new QR code with short timeout to show loading state
  setTimeout(() => {
    try {
      QRCode.toCanvas(
        document.createElement('canvas'),
        text,
        { 
          errorCorrectionLevel: errorLevel,
          width: size,
          margin: 2,
        }, 
        function (err, canvas) {
          // Hide loading state
          generateBtn.disabled = false;
          spinner.classList.add('hidden');
          
          if (err) {
            console.error(err);
            showError('Failed to generate QR code. Please try again.');
          } else {
            // Clear container and append the new canvas
            container.innerHTML = '';
            container.appendChild(canvas);
            
            // Show result card
            resultCard.classList.remove('hidden');
            // Store for download
            window.qrCanvas = canvas;
          }
        }
      );
    } catch (e) {
      console.error(e);
      generateBtn.disabled = false;
      spinner.classList.add('hidden');
      showError('An error occurred. Please try again.');
    }
  }, 300);
}

/**
 * Download the generated QR code as PNG image
 */
function downloadQRCode() {
  if (!window.qrCanvas) return;
  
  const text = document.getElementById('text').value.trim();
  const filename = text.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 20) + '_qrcode.png';
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = window.qrCanvas.toDataURL('image/png');
  link.click();
}

/**
 * Reset the form and clear the generated QR code
 */
function resetForm() {
  document.getElementById('text').value = '';
  document.getElementById('resultCard').classList.add('hidden');
  document.getElementById('qrcode').innerHTML = '';
  document.getElementById('text').focus();
}