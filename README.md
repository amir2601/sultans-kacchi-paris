# Sultan's Kacchi Paris — Maison Royale de Gastronomie

A luxury, editorial Next.js (App Router, TypeScript) web application and administrative kitchen management system for the European branch of **Sultan's Kacchi Paris** at 28 Rue du Faubourg Saint-Denis, 75010 Paris.

Built following **Hallmark (Custom Direction: Bright & Royal Parisian)** with 100% adherence to "The Floor" principles, verified by Hallmark's linter with **0 FAIL, 0 REFLEX, 0 WARN**.

---

## ⚜️ Design & Royal Parisian Theme

- **Atmosphere**: Bright, opulent, and warm — bringing together Mughal Royal Heritage and Parisian High Gastronomy.
- **Palette**:
  - **Paper Ground**: Soft Warm Ivory / Off-White (`#FAF9F6`) with an elegant subtle royal pattern.
  - **Primary Brand Accent**: Rich Burgundy / Deep Maroon (`#4A0E17`).
  - **Royal Accents & Badges**: Metallic Gold (`#C5A059`).
  - **Typography**: Crisp Dark Charcoal (`#1A1A1A`) on warm surfaces.
- **Typography Pairing**:
  - Headings: `Playfair Display` (editorial luxury)
  - Body: `Plus Jakarta Sans` (clean readability)
- **Hallmark Floor Guarantees**:
  - Zero `transition: all` — explicit composite property transitions only.
  - Token-driven colors at `:root`.
  - Zero card-in-card patterns (single containment layer throughout).
  - Zero fake metrics or invented review counts.
  - 1280x800 compliant hero fold.
  - Real authentic menu items and prices in Euros (€).

---

## 🍽️ Official Menu (46 Items from Uploaded Menu)

All 46 items and exact prices in Euros (€) from the official restaurant menu are implemented and mapped to the authentic local food imagery in `public/images/`:

1. **Mutton Kacchi (Sultan's Special)**:
   - Kacchi (€9.90)
   - Kacchi, Borhani (€12.90)
   - Kacchi, Borhani, Firni/Jorda (€14.90)
   - Kacchi, Jali kabab, Borhani, Firni/Jorda (€16.90)
   - Kacchi, Chicken roast, Borhani, Firni/Jorda (€18.90 — Signature Selection)
2. **Polau (Sultan's Special)**:
   - Plain polau, Chicken roast (€9.90)
   - Plain polau, Beef Rezala (€12.90)
   - Plain polau, Chicken roast, Borhani (€12.90)
   - Plain polau, Beef Rezala, Borhani (€14.90)
3. **Tehari (Sultan's Special)**:
   - Beef Tehari (€9.90)
   - Beef Tehari, Jali kabab (€11.90)
   - Beef Tehari, Jali Kabab, Borhani (€14.90)
4. **Weekly Special**:
   - Beef Chui Jhal (€9.90)
   - Mutton Rezala (€9.90)
   - Hass Bhuna (€9.90)
   - Kala Bhuna (€9.90)
   - Beef Mejbaan (€9.90)
5. **Evening Special**:
   - Mutton Halim (€6.90)
   - Buri Fry (€6.90)
   - Thai Soup (€6.90)
   - Whole Chicken Grill Half (€6.90)
   - Whole Chicken Grill Full (€10.90)
6. **Party Special Banquets**:
   - Kacchi, Chicken Roast, Jali kabab, Borhani, Jorda/Firni, Chutney, Salad (€19.90)
   - Kacchi, Jali kabab, Beef Rezala, Borhani, Jorda/Firni, Chutney, Salad (€21.90)
   - Plain Polau, Jali Kabab, Chicken Roast, Beef Rezala/Mutton Rezala, Borhani, Jorda/Firni, Chutney, Salad (€25.90)
7. **Rooti**:
   - Rumali Rooti (€2.50)
   - Plain Nan (€2.00)
   - Garlic Nan (€2.90)
   - Chees Nan (€3.90)
8. **Additional**:
   - Jali Kabab (€2.50)
   - Plain polau (€4.90)
   - Chicken Roast (€6.90)
   - Beef Rezala (€7.90)
   - Chutney (€1.00)
   - French Fry (€2.90)
9. **Desserts**:
   - Firni (€3.00)
   - Jorda (€3.00)
10. **Beverage**:
    - Mineral Water 50cl (€2.50)
    - Gaz Water 50cl (€2.50)
    - Coca cola 33cl (€2.50)
    - Sprite 33cl (€2.50)
    - 7up 33cl (€2.50)
    - Borhani 33cl (€3.00)
    - Mango Lacchi 33cl (€3.00)
    - Badam Sorbat 33cl (€3.00)
    - Zafrani Sorbat 33cl (€3.00)

---

## 📱 Mobile Responsiveness & Branding

- **Mobile Navigation**: Hamburger drawer with touch-friendly links for Menu, Weekly Special, Party Banquets, Heritage, Location, Order Tracking, and Admin.
- **Scrollable Category Tabs**: Horizontal category filter bar on mobile with untracked sentence-case labels.
- **Sultan's Kacchi Paris Branding**: Halal-certified golden royal crown emblem inspired by Sultan's Kacchi Paris official social media and menu cartouche.

---

## 🔍 Order Tracking System (`/track`)

- Customers can enter their unique reference ID (e.g. `SKP-7K92`) or click their recent orders list.
- Real-time progress timeline:
  1. `Kitchen Queued` (Order logged in system)
  2. `In Kitchen` (Dum deg open, banquet being packed hot)
  3. `Ready for Pickup` (Hot & ready at the counter)
  4. `Collected` (Handed over to customer)
- Itemized breakdown in Euros (€) and collection instructions for 28 Rue du Faubourg Saint-Denis, 75010 Paris.

---

## 🛠️ Dynamic Admin & Settings Dashboard (`/admin`)

- **Telemetry Overview (`/admin`)**: Active kitchen queue, order volume, live takeaway revenue in Euros.
- **Dynamic Settings Panel (`/admin/settings`)**:
  - Edit restaurant name, address, métro instructions, phone, and opening hours.
  - Update social links (Facebook, Instagram, WhatsApp).
  - Toggle section visibility (Weekly Special, Party Banquets, Heritage Story, Location).
  - Manage takeaway time slots (add, remove, or adjust collection intervals).
- **Menu Management CRUD (`/admin/menu`)**:
  - Add, edit, price update, and toggle daily availability.
  - Dropdown selector to assign any local food image from `public/images/` or upload custom image.
- **Order Management Queue (`/admin/orders`)**:
  - Real-time Kanban board and List view with status progression (`Pending` -> `Preparing` -> `Ready` -> `Completed` -> `Cancelled`).
  - Status changes update the customer tracking page in real-time.

---

## 🚀 Running Locally

```bash
# Start development server
npm run dev

# Run production build
npm run build
npm start

# Run Hallmark linter
node C:/Users/Riad/.gemini/config/skills/hallmark/scripts/sloplint.mjs app components app/globals.css --genre editorial
```


---

## 🔐 Main Admin Credentials

The administrative kitchen dashboard (`/admin`) is configured with the following main admin account:

- **Email**: `amir26hossin@gmail.com`
- **Password**: `Riad@1234`
- **Role**: `Main Admin`
- **Quick Access**: Click the "Fill login" shortcut button on `/admin/login` or enter credentials manually.
- **Supabase Auth**: Ready for immediate execution in Supabase SQL editor via `supabase/schema.sql` (Section 5).
