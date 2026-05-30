# Technical Architecture Guide

This document provides a deep dive into the system design, code architecture, database models, security configurations, and core workflows of the **Portfolio & Event Booking Platform**.

---

## 1. System Architecture

The platform operates primarily as a serverless Single Page Application (SPA) backed by **Firebase Services** for production operations, with an optional/legacy Node.js Express server backend for specific database and real-time operations.

```
                  +----------------------------------------------+
                  |               React + Vite SPA               |
                  +-------+---------------+---------------+------+
                          |               |               |
       (Firebase SDK)     |               |               | (REST API)
   +----------------------+               |               +-----------------------+
   |                                      |                                       |
   v                                      v                                       v
+------------------+             +-----------------+                     +-----------------+
|  Firebase Auth   |             |  Razorpay SDK   |                     |  Deepseek API   |
+------------------+             +-----------------+                     +-----------------+
| Firestore Cache  |                                                     |   Gemini API    |
+------------------+                                                     +-----------------+
| Firebase Storage |
+------------------+
| Cloud Functions  |
+------------------+
```

---

## 2. Directory Structure & Clean Architecture

The client-side React code in `src/` is structured around **Clean Architecture** patterns, separating business logic from components and data sources.

### `src/domain/` (Core Domain Layer)
Contains the pure enterprise and application business logic. It does not depend on any concrete data framework, UI framework, or library (including Firebase).
*   **Entities** (`src/domain/entities/`): Holds business data models.
    *   [Event.ts](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/src/domain/entities/Event.ts): Standard properties for events (title, location, pricing, capacity).
    *   [Ticket.ts](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/src/domain/entities/Ticket.ts): Ticket specifications, quantity, status, validation records, and metadata.
    *   [Point.ts](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/src/domain/entities/Point.ts): Simple coordinate definitions.
*   **Repositories** (`src/domain/repositories/`): Abstract interfaces that declare required data-access methods (e.g., `EventRepository.ts`).

### `src/data/` (Data Source Layer)
Implements domain repository interfaces by communicating directly with data infrastructures.
*   [FirebaseEventRepository.ts](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/src/data/repositories/FirebaseEventRepository.ts): Implements Firestore queries to fetch and manipulate event data.
*   [GradientRepository.ts](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/src/data/repositories/GradientRepository.ts): Manages background styling and color assets.

### `src/presentation/` (UI Layer)
Contains components, views, styles, and hooks.
*   **Screens** (`src/presentation/screens/`): Top-level routes (e.g., `HomeScreen`, `EventsScreen`, `BookingScreen`, `ProfileScreen`, `ChatScreen`, `AdminScreen`).
*   **Components** (`src/presentation/components/`): Reusable UI layouts grouped logically:
    *   `events/`: Cards, filters, and navbars.
    *   `admin/`: QR scanning sections and actions.
    *   `markdown/`: Interactive slash command menu logic.
*   **Theme** (`src/presentation/theme/`): Styled-component configurations and global styling rules.

### `src/shared/` (Infrastructure & Cross-Cutting Layer)
Shared components, contexts, hooks, utilities, and common type definitions.
*   **Contexts** (`src/shared/context/`): Global state engines.
    *   `AuthContext`: Connects to Firebase Auth, tracks offline state, role-based rules (`isAdmin`).
    *   `ThemeContext`: Controls theme modes across elements.
    *   `ProfileContext`: Manages profile customization.
    *   `AIContext`: Preserves user settings for Deepseek or Gemini assistants.
*   **Hooks** (`src/shared/hooks/`): Custom utilities (e.g., `useCache`, `useDocumentTitle`).
*   **Utilities** (`src/shared/utils/`): Pure functions (e.g., `pdfGenerator` for PDF exports, `qrcode` for QR code generation).

---

## 3. Data Models & Schemas

### Firebase Firestore (Production Store)

#### `users` (Collection)
*   `uid` (string): Document ID matching Firebase Auth.
*   `email` (string): User registration email.
*   `role` ('user' | 'admin'): Controls dashboard and route permissions.
*   `photoURL` (string, optional): Profile photo path.
*   `createdAt` (string): Timestamp of registration.
*   `lastLogin` (string): Timestamp of last sign-in.

#### `events` (Collection)
*   `title` (string): Event name.
*   `description` (string): Event marketing copy.
*   `date` (string): Event schedule.
*   `location` (string): Physical venue or virtual link.
*   `price` (number): Price of 1 ticket in Indian Rupees (₹).
*   `totalTickets` (number): Max availability capacity.
*   `availableTickets` (number): Remaining stock.
*   `soldTickets` (number): Number of purchased tickets.
*   `createdAt` (ServerTimestamp): Document creation time.
*   `lastUpdated` (ServerTimestamp, optional): Edit history tracking.

#### `tickets` (Collection)
*   `eventId` (string): Associated event ID.
*   `userId` (string): Purchasing user ID.
*   `userEmail` (string): Purchasing user email.
*   `eventDetails` (object): Snapshot of event details (title, date, location).
*   `ticketNumber` (string): Unique visual ticket ID.
*   `quantity` (number): Purchased ticket count.
*   `validationsRemaining` (number): Capacity remaining for scans.
*   `usedCount` (number): Number of times scanned.
*   `status` ('valid' | 'used' | 'cancelled'): Current verification state.
*   `purchasedAt` (string): Time of order.
*   `qrCode` (string, base64/url): Encoded verification image.
*   `amountPaid` (number): Paid amount in Rupees (₹).
*   `transactionId` (string): Payment platform transaction reference.
*   `verificationCode` (string): Secure salt verification string.
*   `validations` (array of validation logs):
    *   `timestamp` (string): Scanning time.
    *   `validatedBy` (string): Admin UID.
    *   `validatedByEmail` (string): Admin email.

#### `anonymous_messages` (Collection)
*   `content` (string): Text content sent anonymously.
*   `timestamp` (ServerTimestamp): Message creation time.
*   `isRead` (boolean): Unread tracking for admin view.

#### `conversations` (Collection)
*   `participantIds` (array of strings): UIDs of participants.
*   `participants` (map [string] -> boolean): Rapid mapping checking.
*   `createdBy` (string): Author UID.

#### `messages` (Collection)
*   `senderId` (string): Author UID.
*   `content` (string): Text content.
*   `timestamp` (ServerTimestamp): Timestamp.
*   `encryptedContent` (string, optional): Secure chat content.

---

### MongoDB (Legacy Server Schemas)

#### `User` (Mongoose Schema)
*   `username` (String, required)
*   `email` (String, required, unique)
*   `password` (String, required)
*   `role` (String, enum: ['user', 'admin'], default: 'user')
*   `createdAt` (Date)

#### `Message` (Mongoose Schema)
*   `sender` (ObjectId, ref: 'User')
*   `recipient` (ObjectId, ref: 'User')
*   `content` (String, encrypted)
*   `timestamp` (Date)

---

## 4. Key Workflows

### 4.1. Razorpay Ticket Booking Flow
Integrated client-side via Razorpay checkout services.

```
[BookingScreen] -------------> Check ticket availability in Firestore
      |
      +------(If Avail.)-----> runTransaction to decrease 'availableTickets'
      |                        and reserve ticket seats
      v
[Razorpay SDK] --------------> Initialize window.Razorpay order parameters
      |
      +-----(Success Callback) -> Write to Firestore: 'tickets' collection
      |                        with status: 'valid', including transactionId.
      |                        Generate Ticket PDF/QR.
      v
[Complete Screen]
```

### 4.2. QR Code Generation & Scan Verification
Allows administrative staff to scan and confirm tickets at the venue in real-time.

1.  **Generation**:
    *   The client stringifies a minimal JSON object: `{ t: ticket.id, v: ticket.verificationCode, ts: Date.now() }`.
    *   Passes it to `generateQR()`, which returns a base64 encoded QR Code data URI stored in the Firestore ticket document.
2.  **Scanning**:
    *   Admin opens `ValidateTicketScreen` which opens the camera using `html5-qrcode`.
    *   Extracts the token, parses `ticketId` and `verificationCode`.
3.  **Database Validation Transaction**:
    *   Runs a Firestore transaction to ensure:
        *   Ticket status is `'valid'`.
        *   `validationsRemaining > 0`.
    *   Atomically updates:
        *   `validationsRemaining` (decremented by 1).
        *   `usedCount` (incremented by 1).
        *   `status` (updated to `'used'` if validations reach 0).
        *   Appends a validation record log with the validating admin's details.

### 4.3. AI Copay Generator (Event Creation helper)
Provides automated marketing text directly inside `CreateEventScreen.tsx`.

*   **Models Supported**:
    *   `google/gemini-pro`: Loaded with Google API Key parameters.
    *   `deepseek/deepseek-chat`: Configured via direct fetch calls to `https://api.deepseek.com/chat/completions`.
*   **Execution**:
    *   Admin inputs basic event guidelines.
    *   The selected API receives the prompt parameters and returns refined copy descriptions, mapping the text directly back into the event form.

---

## 5. Security Architecture & Rules

### Firestore Security Rules (`firestore.rules`)
*   **Authentication Check**: All access (read/write) requires authentication (`request.auth != null`).
*   **Admin Check**: Custom helper checking `users/$(uid)` document field `role == 'admin'` grants unlimited access.
*   **Role-Based Security**:
    *   `users`: Read is public to authenticated users; Update is restricted to the specific owner UID or admins; Delete is admin-only.
    *   `conversations`: Read and updates are limited to user UIDs listed in `participantIds` list or owners.
    *   `messages`: Creates require matching `senderId == request.auth.uid`.
    *   `anonymous_messages` (configured in separate `security-rules.txt` script): Write is public (`allow create: if true`), Read and update (marking read) is admin-only.

### Storage Security Rules (`storage.rules`)
*   Provides structured control over media uploads (e.g. `profilePhotos/{userId}`).
*   Requires matching authenticated user token matching user subpath directories.

---

## 6. Legacy Components & Context

The codebase contains legacy folders that were preserved during migrations:
*   `server/`: A standalone Node.js server. Uses WebSocket servers (`ws`) for chats and `Mongoose/MongoDB` for databases. The modern system has transitioned direct communications to Firestore, making this directory legacy.
*   `client/`: Contains pre-integrated layout items and router configs. Direct route definitions inside `client/src/routes/AppRoutes.tsx` redirect users straight into the main application.
