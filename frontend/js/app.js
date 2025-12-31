const form = document.getElementById('newsletterForm');
const output = document.getElementById('output');


form.addEventListener('submit', async (e) => {
e.preventDefault();


const data = {
issue: document.getElementById('issue').value,
month: document.getElementById('month').value,
sections: [
{
category: document.getElementById('category').value,
title: document.getElementById('title').value,
description: document.getElementById('description').value,
image: document.getElementById('image').value,
link: document.getElementById('link').value
}
]
};


const res = await fetch('http://localhost:3000/api/newsletters', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
});


const result = await res.json();
output.textContent = JSON.stringify(result, null, 2);
});


// Load existing newsletters
fetch('http://localhost:3000/api/newsletters')
.then(res => res.json())
.then(data => output.textContent = JSON.stringify(data, null, 2));