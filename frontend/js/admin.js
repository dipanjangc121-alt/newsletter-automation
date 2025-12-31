body {
  font-family: Arial, sans-serif;
  background: #f4f6f9;
}

.dashboard {
  width: 900px;
  margin: 30px auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

#preview {
  max-width: 200px;
  display: block;
  margin-top: 10px;
}
