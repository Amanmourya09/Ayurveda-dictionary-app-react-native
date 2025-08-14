#  Ayurveda Shabdkosh

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React_Native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-%23D04A37.svg?style=for-the-badge&logo=Expo&logoColor=white)](https://expo.dev/)

 **"आयुर्वेद-शब्दार्थबोधिका"** 

A mobile dictionary app to search Sanskrit Ayurvedic terms with meanings, references, and audio support. Built with React Native and Expo for Android.

## 📖 Description

**Ayurveda Shabdkosh** is a modern digital Ayurvedic dictionary that combines multiple Sanskrit-Ayurvedic dictionaries into a single searchable platform. It helps students, researchers, and practitioners of Ayurveda to quickly find meanings, references, and pronunciations of classical terms.

Whether you're studying Charaka Samhita or translating ancient texts, this app simplifies access to authentic Ayurvedic terminology.

---

## ✨ Features

- 🔍 **Search in Devanagari or Roman script** with Google Input Tools support
- 📚 **Filter results** by Word, Description, Reference, or Book
- ❤️ **Save favorites** for quick access
- 🕰️ **Recent search history** stored locally
- 🔊 **Text-to-Speech** to hear Sanskrit pronunciation
- 📋 **Copy word or meaning** to clipboard
- 📖 **Glossary** with Hindi alphabet grid for browsing
- 📱 **Offline-ready** using AsyncStorage
- 🌐 **Light/Dark mode** support
- 📄 **About & How-to-Use** guides included

---
## 🛠️ Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: Expo Router
- **State & Storage**: AsyncStorage (for favorites & history)
- **API**: Custom backend (`/index.php`) for dictionary data
- **UI Components**: React Native Elements, Expo Icons
- **Text-to-Speech**: `expo-speech`
- **Clipboard**: `expo-clipboard`
- **Keyboard**: Custom Hindi keyboard with Google Input Tools API

---

## 📦 Installation

Follow these steps to run the app on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Amanmourya09/Ayurveda-dictionary-app-react-native
cd ayurveda-shabdarthabodhika

2. Install Dependencies
   npm install

3. Install Expo CLI (if not installed)
   npm install -g expo-cli

▶️ Running the App
Using Expo Go (Recommended for Testing)
   npx expo start

Scan the QR code with Expo Go app on your Android device.
Or run in emulator: npx expo start --android

How to Use
Search: Type a Sanskrit word in Devanagari or Roman script.
Filter: Use filters to search in Word, Description, Reference, or Book.
Results: Tap any result to view details.
Actions:
❤️ Tap heart to favorite a word
🔊 Tap speaker to hear the word
📋 Tap copy icon to copy word/meaning
Glossary: Browse words by Hindi alphabet.
Favorites: View and manage saved words.

src/
├── screens/
│   ├── index.tsx           # Home Screen
│   ├── results.tsx         # Search Results
│   ├── favorites.tsx       # Favorite Words
│   ├── glossary.tsx        # Alphabetical Browse
│   ├── about.tsx           # About Ayurveda & App
│   └── howto.tsx           # Usage Guide
├── components/
│   └── HindiKeyboard.tsx   # Virtual Hindi Keyboard
├── utils/
│   └── api.ts              # API Configuration
├── assets/
│   └── logo.png            # App Logo

⚙️ Dependencies
Key packages used:

react-native
expo
@react-native-async-storage/async-storage
expo-speech
expo-clipboard
@expo/vector-icons
expo-router
Ensure all dependencies are installed via package.json.

🔮 Future Enhancements
🌍 Multi-language support (Hindi, English, Sanskrit toggle)
📥 Offline mode with full dictionary download
🔊 Improved TTS with authentic Sanskrit voice
📚 More dictionaries (Charaka, Sushruta, Ashtanga Hridaya, etc.)
📱 iOS Support
🔍 Voice search for hands-free input

📬 Contact
Have questions or suggestions?
Reach out:

Email: amanmourya20030709@gmail.com
GitHub: Amanmourya09
