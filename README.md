
# 🔐 encrypt-react

A lightweight React hook that encrypts outgoing Axios requests and decrypts incoming responses using AES-256-CBC. Designed to work seamlessly with a secure Express backend using the [`encrypt-express`](https://www.npmjs.com/package/encrypt-express) middleware.

> 📦 Built for full-stack encrypted communication.

---

## 📦 Installation

```bash
npm install encrypt-react
````

> Requires React 16.8+ and `axios`.

---

## 🚀 Quick Start

### Step 1: Import and Use the Hook

```jsx
import React from 'react';
import axios from 'axios';
import { useAxiosEncrypt } from 'encrypt-react';

const SECRET_KEY = 'YOUR_64_CHARACTER_HEX_KEY'; // 32-byte hex key

function App() {
  useAxiosEncrypt(SECRET_KEY); // Enables encryption/decryption globally

  const sendData = async () => {
    const res = await axios.post('/api/test', { message: 'Hello World' });
    console.log(res.data);
  };

  return (
    <div>
      <button onClick={sendData}>Send Encrypted Data</button>
    </div>
  );
}

export default App;
```

---

## ⚙️ How It Works

* **Outgoing requests** are encrypted automatically if the body is an object.
* **Incoming responses** are decrypted if they follow the `{ data: "<encrypted>" }` format.
* Axios interceptors are attached and detached automatically via `useEffect`.

---

## 🔐 Encryption Details

* **Algorithm**: AES-256-CBC (via `crypto-js`)
* **Key**: 64-character hex string (32 bytes)
* **IV**: Random 16-byte IV prepended to the ciphertext

> The backend must use the same encryption logic. Check out [`encrypt-express`](https://www.npmjs.com/package/encrypt-express) for a drop-in Express middleware.

---

## 🧪 Example Encrypted Payload

```json
{
  "data": "3e1f7f9b3e3b7a2a1e...:7a8f21cb7b95d9e1..." 
}
```

---

## ✅ Requirements

* React 16.8 or newer
* `axios` installed
* A 64-character hex key for consistent AES encryption

---

## 🤝 Backend Integration

This package is designed to work with the [**encrypt-express**](https://www.npmjs.com/package/encrypt-express) middleware for automatic decryption on the server and encrypted responses back to the client.

---

## 🧠 Tips

* Use environment variables to manage your secret key securely.
* Ensure all requests are made over HTTPS to prevent MITM attacks.
* Only encrypt JSON payloads; avoid encrypting `FormData` or binary blobs.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Made with security in mind by [@Sonu](https://github.com/sonumehtaskr). Contributions and feedback are welcome!

```