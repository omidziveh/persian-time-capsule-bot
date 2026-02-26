# Histo-gram 3.0 - Project Documentation

## 1. Project Overview
**Vision:** A high-quality Telegram bot delivering 2-3 significant historical events daily in Persian.
**Core Philosophy:** "Editor-First Architecture." The bot serves as a publisher for high-end, manually curated content, ensuring quality control and system stability.

**Key Features:**
*   **Persian History:** Focus on Iranian and World history tailored for a Persian audience.
*   **Date Formatting:** Display dates in **Shahanshahi** format with **Jalali** in parentheses.
*   **Smart Inventory:** Automated warnings when content stock runs low.
*   **Staged Deployment:** New features are tested by a dedicated group before public release.

---

## 2. Infrastructure & Tech Stack
*   **Language:** TypeScript (Strict Mode).
*   **Runtime:** **Cloudflare Workers** (Serverless, Global Edge).
*   **Database:** **Cloudflare D1** (SQLite at the Edge).
*   **ORM:** **Drizzle ORM** (Type-safe SQL interactions).
*   **Bot Framework:** **GrammY** (using Webhooks).
*   **Scheduling:** **Cloudflare Cron Triggers**.

---

## 3. Project Foundation (Upgrade Strategy)
To ensure the bot can be upgraded easily without breaking the live experience for users, the architecture follows a **Role-Based Access Control (RBAC)** pattern.

### A. The Database Foundation
The `subscribers` table will have a `role` column.
*   **Roles:** `admin`, `tester`, `user`.
*   **Purpose:** This allows the code to branch logic based on who is using it.

### B. The "Canary" Deployment Flow
When you code a new feature (e.g., a new settings menu), the workflow is:
1.  **Code & Deploy:** You push the new code to the Cloudflare Worker.
2.  **Feature Flag Logic:**
    *   The code checks: `if (user.role === 'tester' || user.role === 'admin')` -> Show New Feature.
    *   `else` -> Show Old Stable Version.
3.  **Testing:** You and your tester group use the bot. The new feature is active for you, but invisible to normal users.
4.  **Publish:** Once verified that the feature is stable and doesn't crash the bot, you push a config update to enable it for `user` role as well.

**Benefit:** You never have to take the bot offline to add features. Normal users always see a stable version while you test changes in the production environment.

---

## 4. The Content Workflow

### A. Content Management (The Inventory System)
The bot maintains a "stock" of historical events.

1.  **Bulk Ingestion:**
    *   You generate content (e.g., 60 days' worth) using high-end AI models externally.
    *   You send this data to the bot via the Admin Panel.
    *   **Logic:** The bot parses the raw text and saves it. It allows storing multiple events for a single day.
2.  **Low Stock Warning:**
    *   Every night, the bot checks the inventory.
    *   **Trigger:** If the number of days with available content drops below **5 days**, the bot sends an alert to the Admin Chat: *"Warning: Content stock is low. Only 4 days remaining. Please restock."*

### B. The "Nightly Preview" & Approval
Every night (e.g., 11:00 PM), the bot prepares the content for the next day.

1.  **Preview Message:** The bot sends the proposed post to the **Admin Chat**.
2.  **Action Buttons:** The Admin has three options:
    *   **✅ Approve (or Ignore):** The content is scheduled for sending.
    *   **🔄 Retry:** The bot discards this specific event and fetches a *different* event for the same date from the database (if available).
    *   **🚫 Don't Send:** The bot cancels the post for this date. No message is sent to users the next morning.

---

## 5. User Features

### A. Standard Broadcast
Users receive the daily historical event automatically at the scheduled time (e.g., 9:00 AM).

**Message Format:**
```markdown
📅 [Shahanshahi Date] ([Jalali Date])

[Image]

[Title]
[Description...]

#Hashtags
```
*Calculation Logic:* Shahanshahi Year = Jalali Year + 1180.

### B. Lifecycle Management
*   **Welcome (`/start`):** A welcoming message in Persian explaining the bot's purpose and schedule.
*   **Goodbye (`/stop`):** Handled gracefully. The bot logs the user's departure and removes them from the subscriber list.

---

## 6. Database Schema (Draft)

**Table: `events`**
*   `id`: UUID
*   `jalali_month`: Int
*   `jalali_day`: Int
*   `content_text`: Text (Persian)
*   `content_title`: Text
*   `historical_year`: String (Used for the date calculation)
*   `image_url`: Text
*   `is_approved`: Boolean (Default: false) - *Set to true after Admin Approves.*
*   `created_at`: Datetime

**Table: `subscribers`**
*   `user_id`: BigInt (Primary Key)
*   `role`: Enum ('admin', 'tester', 'user') - *Critical for the upgrade strategy.*
*   `joined_at`: Datetime

---

## 7. Development Roadmap

### Phase 1: Foundation
1.  Initialize Cloudflare Worker project with TypeScript.
2.  Setup D1 Database and Drizzle ORM.
3.  Implement the Schema.
4.  Deploy basic bot skeleton to Cloudflare.

### Phase 2: The Admin & Ingestion
1.  Build the **Admin Ingestion Tool** (parsing raw text into the DB).
2.  Implement the **Low Stock Warning** logic.
3.  Test data storage and retrieval.

### Phase 3: The Publisher
1.  Implement the **Nightly Preview** logic.
2.  Implement the "Approve/Retry/Skip" interface.
3.  Implement the **Shahanshahi Date Conversion** logic ($Jalali + 1180$).
4.  Implement the daily broadcast Cron Job.

### Phase 4: Polish & Lifecycle
1.  Implement **Welcome/Goodbye** messages.
2.  Setup the **Tester Role** logic for future updates.
3.  Final styling and error handling.