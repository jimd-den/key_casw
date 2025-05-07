
# 🔑 Key Case: Unravel Digital Mysteries! 🕵️‍♂️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Welcome to **Key Case**, the ultimate platform for amateur detectives and mystery crafters! Dive into a world where your unique digital identity is the key to unlocking secrets, solving intricate cases, or designing your own perplexing puzzles for others to solve.

![Key Case Gameplay Screenshot (Conceptual)](https://picsum.photos/seed/keycaseapp/800/400?data-ai-hint=mystery%20game)
*(Conceptual: Replace with an actual screenshot of your app!)*

## 🚀 What is Key Case?

Key Case is a Next.js web application where users can:

*   **Solve Mysteries:** Browse a collection of user-created cases, examine evidence, take notes, and submit your solution.
*   **Create Cases:** Design your own elaborate mysteries, complete with descriptions, evidence (pictures, documents, audio, notes), suspects, victims, and a secret solution.
*   **Digital Key Identity:** Your account is secured by a unique, client-side generated P-256 elliptic curve key pair. Your public key acts as your identifier, while your private key (which you keep safe!) proves your identity.

## ✨ Features

*   **🔐 Secure Key-Based Authentication:** Unique digital identity using Web Crypto API for key generation.
*   **🧩 Case Creation & Solving:** Intuitive forms for creating detailed mystery cases and a rich interface for solving them.
*   **🖼️ Diverse Evidence Types:** Support for pictures, documents (text-based), audio files, and plain text notes.
*   **📝 Detective Notes:** Built-in note-taking feature per case, saved locally in your browser.
*   **🎨 Modern UI:** Sleek and responsive design built with Next.js, Tailwind CSS, and ShadCN UI components.
*   **☁️ Cloud-Powered:** Firebase Firestore for persistent data storage.
*   **🤖 (Future) AI Integration:** Potential for Genkit-powered AI features to enhance case creation or provide hints.

## 🛠️ How It Works

1.  **Sign Up:** Generate a unique P-256 public/private key pair directly in your browser. Your **public key** becomes your user ID. **Crucially, save your private key securely!** The app *never* stores your private key.
2.  **Log In:** Prove you own your private key (simulated in this version, but designed for cryptographic proof) to access your account.
3.  **Explore:**
    *   **Solve:** Pick a published mystery, examine clues, and deduce the solution.
    *   **Create:** Build your own case, adding all the necessary details and evidence. You can choose to publish it for others.
4.  **Publish:** Share your crafted mysteries with the community.

## 💻 Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, ShadCN UI
*   **Backend/Database:** Firebase Firestore
*   **Authentication:** Custom, based on Web Crypto API (client-side key generation)
*   **AI (Planned):** Genkit with Google AI models

## 🚀 Getting Started

To get Key Case running locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/key-case.git 
    cd key-case
    ```
    *(Replace `your-username/key-case.git` with the actual repository URL)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Add a Web app to your Firebase project.
    *   Copy the Firebase configuration object.
    *   Create a `.env.local` file in the root of the project and add your Firebase config:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
        ```
    *   In the Firebase console, go to **Firestore Database** and create a database. Start in **test mode** for easy setup (for production, configure security rules).

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **(Optional) Genkit Development:**
    If you're working with Genkit flows:
    ```bash
    npm run genkit:dev
    ```

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find bugs, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy sleuthing! 🔎
