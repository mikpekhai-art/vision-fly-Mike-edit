# Vision Fly - Private Jet Charter Booking Website

## Overview
Vision Fly is a modern private jet charter booking website, inspired by Air Canada's UI/UX, built with Next.js. Its primary purpose is to offer a seamless platform for flight search, private charter inquiries, and empty leg subscriptions. The project aims to provide a luxurious and efficient booking experience with a focus on real-time information and personalized services, catering to the high-end travel market. Key capabilities include dynamic flight search with Amadeus API integration, comprehensive private charter booking, curated travel packages, and an empty leg subscription service, all designed with a horizontal search layout and full mobile responsiveness.

## User Preferences
I prefer iterative development with clear communication at each step. Please ask for confirmation before making significant architectural changes or adding new external dependencies. I value concise explanations but appreciate detailed breakdowns when complexity is high. Do not change the overall Air Canada-inspired design aesthetic. Ensure all user-facing text is professional and aligns with a luxury brand image. All forms should have robust validation and provide clear user feedback.

## System Architecture
The application is built on **Next.js 14.2.5**, leveraging **Tailwind CSS** and **Emotion** for styling, and **Radix UI** for accessible UI components (Dialog, Popover, Select, Tabs). **React Hook Form** with **Zod** is used for form management and validation, while **date-fns**, **dayjs**, and **react-day-picker** handle date logic. **Lucide React** provides icons, and **React Hot Toast** is used for notifications.

**UI/UX Design:**
- **Air Canada-inspired aesthetic:** Features large airport code displays, clean white card layouts, and a sophisticated color palette (e.g., customBlue #065777).
- **Horizontal search layout** for desktop, dynamically adapting to a **vertical stack layout on mobile** with full responsiveness.
- **Unified styling** across interactive elements like dropdowns and buttons for visual consistency.
- **Rich autocomplete dropdowns** for airport selection, displaying IATA codes, city, country, and full airport names with clear visual hierarchy.
- **Empty state icons** (PlaneTakeoff, PlaneLanding) and "Click to change" hints for improved user guidance in airport selection fields.
- **Modal dialogs** (Radix UI) are used for booking inquiries, charter requests, and travel package inquiries to maintain focus and gather detailed information.

**Technical Implementations:**
- **Flight Search:** Features a dynamic flight search component (`BookFlight.tsx`) with conditional rendering for trip types (one-way/round-trip), passenger counters, and a unified date picker system. It integrates with the **Amadeus Flight Offers API** for real-time pricing, with a fallback to custom quote requests.
- **Private Charter:** A dedicated page (`private-charter/page.tsx`) mirrors the BookFlight component's UI, offering a robust charter request system with airport autocomplete, date selection, passenger manifests, and a specialized inquiry modal.
- **Travel Packages:** (`travel-packages/page.tsx`) presents 6 curated travel packages with visual cards, filtering options, and an inquiry modal for bookings or custom trip requests.
- **Empty Leg Subscription:** (`empty-leg/page.tsx`) includes an enhanced subscription modal with consent management and dynamic date generation.
- **Programmatic SEO:** Dynamic route pages (`app/routes/[slug]/page.tsx`) are generated from `lib/routesData.ts` for popular Nigerian routes, featuring SEO-optimized descriptions and internal linking from the footer.
- **Dual-Email System:** All forms (Contact, Private Charter, Booking, Empty Leg, Travel Packages) utilize **Nodemailer** via server-side API routes (`app/api/.../route.ts`) to send dual emails: an internal notification to `process.env.GMAIL_USER` and a branded confirmation email to the user. This replaces client-side EmailJS for these functionalities.
- **State Management:** Local React state is extensively used within components like `BookFlight.tsx` for managing UI interactions and form data.
- **Airport Data:** Airport search functionalities utilize a client-side filtered dataset from `https://raw.githubusercontent.com/mwgg/Airports/master/airports.json`.

**System Design Choices:**
- **Mobile-first responsive design** ensuring optimal user experience across all devices.
- **Component-based architecture** with clear separation of concerns (e.g., `landing-page` components).
- **Robust form validation** using React Hook Form and Zod schemas.
- **Toast notifications** for user feedback on actions.
- **Server-side API routes** for handling all email communications for enhanced security and reliability.

## External Dependencies
- **Amadeus Flight Offers API:** Used for real-time flight pricing and availability in the flight search component.
- **GitHub Airports API:** `https://raw.githubusercontent.com/mwgg/Airports/master/airports.json` provides airport data for autocomplete features.
- **Nodemailer:** Utilized for server-side email sending, handling all admin notifications and user confirmations.
- **Google Maps API (implicit/future):** Although not explicitly detailed as integrated, the project envisions geographical data interaction for routes and locations.