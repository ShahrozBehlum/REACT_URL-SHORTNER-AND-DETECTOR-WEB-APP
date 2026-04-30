# URL Shortener & Malware Detector (React App)

## 📌 Project Overview

This is a modern web application built using React that allows users to shorten long URLs and check their safety using a malware detection API. The system helps users identify potentially harmful links such as phishing, malware, or suspicious websites before opening or sharing them.

The project integrates a URL shortening feature along with real-time security analysis using the VirusTotal API, making it both a utility and a security-focused tool.

---

## 🚀 Features

* 🔗 Shorten long URLs into clean, shareable links
* 🛡️ Detect malicious or unsafe URLs
* ⚡ Real-time API-based scanning
* 📋 Copy shortened links easily
* 📱 Fully responsive UI (mobile + desktop)
* 🔍 Check phishing and malware threats
* 🎯 Simple and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript (ES6+)
* HTML5
*Tailwind CSS 

### API Integration

* VirusTotal API (for malware detection)
* URL Shortening API (if used)
* Fetch / Axios for API calls

### Tools

* Node.js (development environment)
* Git & GitHub (version control)

---

## 📂 Project Structure

```
urlshortner/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
|   ├── context/ 
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder:

```
VITE_VIRUSTOTAL_API_KEY=your_api_key_here
```

---

### 4️⃣ Run the Application

```
npm run dev
```

---

## 🌐 Running App

After starting the server, open:

```
http://localhost:5173
```

---

## 🔐 Security Notes

* Do NOT expose API keys in frontend code
* Always use `.env` file for sensitive data
* Keep VirusTotal API key secure

---

## 📈 Future Improvements

* Custom domain short links
* User authentication system
* Link history dashboard
* QR code generation for links
* Analytics for click tracking
* AI-based phishing detection improvements

---

## 🤝 Contribution

Contributions are welcome. Fork the repo, make changes, and submit a pull request.

---

## 📜 License

This project is developed for educational purposes.

---

## 👨‍💻 Author

Developed by Shahroz Malik
MERN Stack Developer | Software Engineering Student

---

⭐ If you like this project, give it a star on GitHub!
