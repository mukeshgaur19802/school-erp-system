# Step-by-Step Guide: Firebase Console, GitHub & Vercel Live Deployment

This guide explains how to register your School ERP on **Firebase Console**, push your codebase to **GitHub**, and launch a live **Vercel** HTTPS link so your app can be accessed anywhere on any mobile phone.

---

## 1. ⚡ Firebase Console Registration & Realtime DB Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Create a project** (or *Add Project*).
   - Name: `school-erp-system`
   - Click **Continue** (you can disable or enable Google Analytics as preferred).
3. Once created, click the **Web icon (`</>`)** on the project overview page to register a Web App:
   - App Nickname: `School ERP Web`
   - Click **Register app**.
4. Firebase will show your `firebaseConfig` keys. Copy these values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=school-erp-system.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=school-erp-system
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=school-erp-system.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```
5. Create a file named `.env.local` inside your project root (`d:\my-new-project`) and paste your keys.
6. In Firebase Console side menu:
   - Click **Build $\rightarrow$ Firestore Database** $\rightarrow$ Click **Create Database** $\rightarrow$ Choose **Test Mode**.
   - Click **Build $\rightarrow$ Authentication** $\rightarrow$ Click **Get Started** $\rightarrow$ Enable **Phone** and **Email/Password**.

---

## 2. 🐙 Push Codebase to GitHub

1. Open your terminal in `d:\my-new-project` and run:
   ```bash
   git init
   git add .
   git commit -m "School ERP Mobile UX & Firebase Ready"
   ```
2. Go to [GitHub.com](https://github.com/new) and create a new repository:
   - Repository Name: `school-erp-system`
   - Set to **Public** or **Private**.
3. Link and push your local repo to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/school-erp-system.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. 🚀 Deploy Live on Vercel for Mobile Access

1. Go to [Vercel.com](https://vercel.com/) and sign in (using GitHub).
2. Click **Add New $\rightarrow$ Project**.
3. Select your **`school-erp-system`** repository from GitHub.
4. Under **Environment Variables**, paste the `NEXT_PUBLIC_FIREBASE_*` keys copied from Step 1.
5. Click **Deploy**!
6. Vercel will build your app and provide a live public HTTPS URL (e.g. `https://school-erp-system.vercel.app`).

> **Now you and your users can open `https://school-erp-system.vercel.app` on any smartphone, tablet, or PC worldwide!**
