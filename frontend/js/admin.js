// ===============================
// Newsletter Admin Panel Logic
// ===============================

// Get form and elements
const form = document.getElementById('newsletterForm');
const previewImg = document.getElementById('preview');
const output = document.getElementById('output');

// 🔗 BACKEND API BASE URL (RENDER)
const API_BASE_URL = 'https://newsletter-backend-mgo0.onrender.com';

// Image preview when file is selected
document.getElementById('image').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = 'block';
  }
});

// Handle form submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Collect form data
  const data = {
    issue: document.getElementById('issue').value,
    month: document.getElementById('month').value,
    publishDate: document.getElementById('publishDate').value,
    sections: [
      {
        category: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        image: previewImg.src || '',
        link: document.getElementById('link').value
      }
    ]
  };

  try {
    // Send data to backend API
    const response = await fetch(`${API_BASE_URL}/api/newsletters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to save newsletter');
    }

    // Show success output
    output.style.color = 'green';
    output.textContent =
      '✅ Newsletter saved successfully!\n\n' +
      JSON.stringify(result, null, 2);

    // Reset form
    form.reset();
    previewImg.style.display = 'none';

  } catch (error) {
    // Show error output
    output.style.color = 'red';
    output.textContent =
      '❌ Error while saving newsletter:\n' +
      error.message;
  }
});
