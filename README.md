# Interactive Wall Calendar Component

A polished, highly interactive React/Next.js calendar component built for a Frontend Engineering Challenge. This project translates a static design concept into a highly functional, responsive, and user-friendly web component, emphasizing modern frontend architecture, accessibility, and elevated UX interactions.

**[Link to Live Demo [Vercel](https://tuf-calender-flow.vercel.app/)]** | **[Link to Video Walkthrough [Youtube](https://youtu.be/P0i83MPLw14)]**

## ✨ Core Features & Creative Liberties

This component fulfills all baseline requirements while introducing several advanced features to demonstrate deep product sense and technical capability:

* **Wall Calendar Aesthetic:** Mimics a physical desk/wall calendar, complete with a spiral binder overlay and 3D page-flip animations when navigating between months.
* **Dynamic Theming:** Uses `colorthief` to extract the dominant color from the current month's hero image and dynamically applies it to the UI (focus rings, active states, and headers).
* **Hybrid Date Range Selection:** Users can select date ranges across multiple months. The grid supports click-to-select, drag-to-select for desktop, and touch-drag selection for mobile devices.
* **Smart Notes Persistence:** Features an integrated notes section for both specific dates and general monthly memos. Notes are persisted purely on the client-side, and the calendar grid renders visual dot indicators on any day containing saved data.
* **"No-Backend" Reminder System:** Adhering strictly to the frontend constraints, reminders are handled in two ways:
    1.  **In-App Toasts:** A welcome-back toast notification triggers on mount if the user has a note saved for the current real-world date.
    2.  **Native `.ics` Export:** Users can download an `.ics` file directly from their notes to trigger native push notifications via Apple or Google Calendar.
* **Advanced Accessibility (a11y):** Full keyboard navigation support (Arrow keys for grid movement, `Enter` to select, `PageUp`/`PageDown` for month switching).
* **Fully Responsive:** Adapts flawlessly from a side-by-side desktop layout to a stacked mobile view.

## 🛠 Tech Stack

* **Framework:** Next.js (React) - Chosen for seamless deployment and optimized asset handling.
* **Styling:** Tailwind CSS - Utilized for rapid, utility-first responsive design without the overhead of heavy component libraries.
* **Date Logic:** `date-fns` - A lightweight library used to cleanly generate the month matrices and handle chronological comparisons.
* **Animations:** `framer-motion` - Powers the 3D month-to-month page flipping.
* **Data Persistence:** `localStorage` API - Used to satisfy the requirement for client-side data handling without an external database.
* **Utilities:** `colorthief` (dynamic theming), `ics` (reminder generation), `react-hot-toast` (notifications), `lucide-react` (SVG iconography).

## 📐 Architectural Choices

* **Strictly Frontend:** The architecture relies entirely on the client. All state management (selection ranges, viewing months) is lifted to a master wrapper (`CalendarApp`), flowing downwards to isolated, stateless child components (`CalendarGrid`, `NotesSidebar`, `HeroPanel`). 
* **Touch Optimization:** Realized that standard `onMouseEnter` events fail on mobile. Implemented a custom `onTouchMove` handler reading `data-date` attributes from the DOM to enable fluid finger-drag highlighting on phones and tablets.

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/alimehdi04/tuf-calender-flow.git
    cd calender-flow
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **View the app:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*Developed for the Frontend Engineering Challenge.*