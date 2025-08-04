# Topper's Toolkit

This is a Next.js starter project for Topper's Toolkit, an online platform for quality school notes.

To get started, take a look at `src/app/page.tsx`.

## Admin Portal Setup

The admin portal is located at `/admin` and is protected by a passphrase. To set up the admin passphrase manually in Firestore, follow these steps:

1.  **Go to the Firebase Console**: Navigate to your project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Open Firestore**: Go to the **Build > Firestore Database** section.
3.  **Create Collection**: Create a new collection named `settings`.
4.  **Create Document**: Inside the `settings` collection, create a document with the ID `admin`.
5.  **Add Passphrase Field**: In the `admin` document, add a new field:
    *   **Field name**: `passphrase`
    *   **Field type**: `string`
    *   **Field value**: `CreditNahiDiyeKuldeep`
6.  **Save** the document.

The application will now use this passphrase to authenticate access to the admin portal.

