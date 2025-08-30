# Zatar Samar - Arabic RTL E-commerce Store

A beautifully crafted Arabic e-commerce storefront for Zatar Samar, a Kuwait-based brand selling premium zatar, olive oil, and Levantine condiments.

**Experience Qualities**:
1. **Authentic** - Respectful Arabic typography and RTL layout that feels natural to Arabic speakers
2. **Elegant** - Clean, premium design that reflects the quality of artisanal Levantine products
3. **Effortless** - Seamless shopping experience from browsing to WhatsApp order completion

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-page product catalog with cart state management and Shopify API integration

## Essential Features

### Product Catalog Display
- **Functionality**: Fetches and displays products from Shopify Storefront API in responsive grid
- **Purpose**: Showcase the full range of Zatar Samar products with authentic Arabic presentation
- **Trigger**: User lands on homepage
- **Progression**: API fetch → Product grid render → Lazy load images → Interactive product cards
- **Success criteria**: Products load within 2 seconds, images are crisp, Arabic text is properly rendered RTL

### Shopping Cart Management
- **Functionality**: Add/remove items, adjust quantities, persist cart state
- **Purpose**: Allow customers to build their order before WhatsApp submission
- **Trigger**: User clicks "Add to Cart" on any product
- **Progression**: Add item → Update cart badge → Navigate to cart → Review items → Modify as needed
- **Success criteria**: Cart persists across page reloads, quantities update smoothly, total calculates correctly

### WhatsApp Order Generation
- **Functionality**: Converts cart contents into formatted Arabic WhatsApp message
- **Purpose**: Enable offline order fulfillment through established WhatsApp business communication
- **Trigger**: User completes customer info and clicks "Send Order via WhatsApp"
- **Progression**: Validate form → Generate Arabic message → Encode for WhatsApp → Open WhatsApp with pre-filled message
- **Success criteria**: Message contains all order details in proper Arabic format, WhatsApp opens successfully

### RTL Arabic Interface
- **Functionality**: Complete right-to-left interface with proper Arabic typography
- **Purpose**: Provide culturally appropriate experience for Arabic-speaking customers
- **Trigger**: Application loads with `dir="rtl"` and `lang="ar"`
- **Progression**: Set HTML attributes → Apply RTL styles → Flip directional icons → Render Arabic text
- **Success criteria**: All text flows RTL, layout mirrors appropriately, numbers remain LTR

## Edge Case Handling

- **Empty Cart**: Display encouraging message in Arabic with featured products
- **Network Errors**: Graceful fallback with retry option and clear Arabic error messages  
- **Invalid Products**: Skip broken items in catalog with admin notification capability
- **WhatsApp Unavailable**: Provide copy-to-clipboard alternative with instructions
- **Large Orders**: Truncate WhatsApp message if it exceeds character limits

## Design Direction

The design should evoke the warmth and authenticity of traditional Levantine markets while maintaining modern e-commerce sophistication - think premium spice merchants meets contemporary Arabic digital design with rich textures and elegant typography.

## Color Selection

Triadic color scheme inspired by traditional Levantine ingredients and warm hospitality.

- **Primary Color**: Rich olive green `oklch(0.45 0.15 120)` communicating natural authenticity and premium quality
- **Secondary Colors**: Warm sand `oklch(0.85 0.08 70)` for cards and backgrounds, deep paprika `oklch(0.35 0.18 25)` for accents
- **Accent Color**: Warm saffron `oklch(0.75 0.12 85)` for call-to-action buttons and highlights
- **Foreground/Background Pairings**: 
  - Background (Cream #F8F6F2): Dark olive text `oklch(0.25 0.15 120)` - Ratio 5.2:1 ✓
  - Card (Warm Sand): Dark olive text `oklch(0.25 0.15 120)` - Ratio 4.8:1 ✓
  - Primary (Olive Green): White text `oklch(0.95 0 0)` - Ratio 6.1:1 ✓
  - Accent (Saffron): Dark olive text `oklch(0.25 0.15 120)` - Ratio 4.5:1 ✓

## Font Selection

Typography should honor Arabic calligraphic traditions while ensuring excellent digital readability - using Noto Sans Arabic for its comprehensive Arabic character support and harmonious proportions.

- **Typographic Hierarchy**: 
  - H1 (Store Name): Noto Sans Arabic Bold/32px/tight letter spacing for brand presence
  - H2 (Product Names): Noto Sans Arabic Semibold/24px/normal spacing for clear hierarchy  
  - Body (Descriptions): Noto Sans Arabic Regular/16px/1.6 line height for comfortable reading
  - Small (Prices): Noto Sans Arabic Medium/14px with enhanced contrast

## Animations

Subtle animations should reflect the careful, artisanal nature of the products - gentle transitions that feel handcrafted rather than mechanical, with special attention to RTL directional movement.

- **Purposeful Meaning**: Smooth right-to-left sliding animations for navigation, gentle scale transitions for product interactions
- **Hierarchy of Movement**: Product cards get subtle hover lift, cart updates with satisfying bounce, page transitions slide from right

## Component Selection

- **Components**: Card for products, Sheet for cart drawer, Button with Arabic text support, Input with RTL alignment, Badge for cart counter, Separator for content sections
- **Customizations**: Custom RTL-aware product grid, Arabic-specific form validation, WhatsApp message formatter component
- **States**: Buttons show loading states with Arabic text, products have hover/focus states, cart shows empty/loading/error states
- **Icon Selection**: ArrowRight becomes ArrowLeft in RTL, Plus/Minus for quantities, ShoppingCart for cart, WhatsApp brand icon
- **Spacing**: Consistent 4/6/8/12/16px spacing using Tailwind scale, generous padding for touch-friendly mobile experience
- **Mobile**: Mobile-first responsive grid (1 col mobile, 2 col tablet, 3+ desktop), collapsible navigation, touch-optimized buttons (min 44px height)