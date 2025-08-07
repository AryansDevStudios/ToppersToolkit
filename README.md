push# Topper's Toolkit

This is a Next.js starter project for Topper's Toolkit, an online platform for quality school notes.

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

1.  **Copy the example environment file**:
    ```bash
    cp .env.example .env
    ```

2.  **Fill in the environment variables**:
    Open the newly created `.env` file and replace the placeholder values with your actual Firebase project credentials and a secure admin passphrase.

    ```
    # .env
    NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
    # ... and so on for all variables
    ADMIN_PASSPHRASE="your-super-secret-passphrase"
    ```

## Admin Portal Setup

The admin portal is located at `/admin` and is protected by the `ADMIN_PASSPHRASE` you set in your `.env` file.

Alternatively, you can set the passphrase in Firestore for more dynamic control:

1.  **Go to the Firebase Console**: Navigate to your project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Open Firestore**: Go to the **Build > Firestore Database** section.
3.  **Create Collection**: Create a new collection named `settings`.
4.  **Create Document**: Inside the `settings` collection, create a document with the ID `admin`.
5.  **Add Passphrase Field**: In the `admin` document, add a new field:
    *   **Field name**: `passphrase`
    *   **Field type**: `string`
    *   **Field value**: Your desired passphrase.
6.  **Save** the document.

The application will prioritize the passphrase from Firestore if it exists, otherwise it will fall back to the one in your `.env` file.
