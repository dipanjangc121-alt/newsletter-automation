// ===============================
// Newsletter Admin Panel Logic
// ===============================

// Form
const form = document.getElementById('newsletterForm');

// Image input
const imageInput = document.getElementById('image');

// Image preview
const previewImg = document.getElementById('preview');

// Backend API
const API_BASE_URL = 'https://newsletter-backend-mgo0.onrender.com';

// ---------------------------------
// Image preview + size validation
// ---------------------------------
imageInput.addEventListener('change', function (e) {
  const file = e.target.files[0];

  if (!file) {
    previewImg.style.display = 'none';
    return;
  }

  // ✅ Frontend size validation (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('❌ Image size must be less than 2MB');
    imageInput.value = '';
    previewImg.style.display = 'none';
    return;
  }

  previewImg.src = URL.createObjectURL(file);
  previewImg.style.display = 'block';
});

// ---------------------------------
// Handle form submission
// ---------------------------------
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const formData = new FormData();

    // Text fields
    formData.append('issue', document.getElementById('issue').value);
    formData.append('month', document.getElementById('month').value);
    formData.append('publishDate', document.getElementById('publishDate').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('link', document.getElementById('link').value);

    // Image
    if (imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }

    // 🔥 CALL FULL GENERATE ENDPOINT
    const response = await fetch(
      `${API_BASE_URL}/api/newsletters/generate`,
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    if (!response.ok || !result.id) {
      throw new Error(result.error || 'Failed to generate newsletter');
    }

    const newsletterId = result.id;

    // ✅ OPEN PREVIEW AUTOMATICALLY
    window.open(
      `${API_BASE_URL}/api/newsletters/${newsletterId}/preview`,
      '_blank'
    );

    // Reset form
    form.reset();
    previewImg.style.display = 'none';

    alert('✅ Newsletter generated, emailed, and preview opened');

  } catch (error) {
    console.error(error);
    alert('❌ Error:\n' + error.message);
  }
});
