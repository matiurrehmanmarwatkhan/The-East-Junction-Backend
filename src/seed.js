import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";
import MenuItem from "./models/MenuItem.js";
import Review from "./models/Review.js";
import Gallery from "./models/Gallery.js";
import Message from "./models/Message.js";
import RestaurantSetting from "./models/RestaurantSetting.js";
import Reservation from "./models/Reservation.js";
import BirthdayEvent from "./models/BirthdayEvent.js";

dotenv.config();

const defaultCategories = [
  { id: "cat_1", name: "Burgers", slug: "burgers", icon: "Beef" },
  { id: "cat_2", name: "Pizza", slug: "pizza", icon: "Pizza" },
  { id: "cat_3", name: "Chinese", slug: "chinese", icon: "Flame" },
  { id: "cat_4", name: "Steaks", slug: "steaks", icon: "ChefHat" },
  { id: "cat_5", name: "Platters", slug: "platters", icon: "UtensilsCrossed" },
  { id: "cat_6", name: "Pasta", slug: "pasta", icon: "Soup" },
  { id: "cat_7", name: "Biryani", slug: "biryani", icon: "Calendar" },
  { id: "cat_8", name: "Drinks", slug: "drinks", icon: "Wine" },
  { id: "cat_9", name: "Desserts", slug: "desserts", icon: "IceCream" }
];

const defaultMenuItems = [
  {
    id: "menu_1",
    name: "Turkish Platter",
    description: "Premium selection of charcoal-sizzled lamb seekh, beef skewers, shish taouk tenders, and garlic flatbread on a bed of gold saffron-infused rice.",
    price: 1850,
    categorySlug: "platters",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Chef Special", "Premium", "Sharing Platter"]
  },
  {
    id: "menu_2",
    name: "Signature Gourmet Burger",
    description: "Char-crusted double prime brisket blend patty, caramelized balsamic onion marmalade, melted sharp cheddar, signature gold mayo, nested in toasted artisanal brioche.",
    price: 850,
    categorySlug: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Best Seller", "Juicy"]
  },
  {
    id: "menu_3",
    name: "Tarragon Grilled Steak",
    description: "USDA Prime tenderloin medallion, flame-grilled and finished with pure butter, served with rich velvety garden-rosemary tarragon cream sauce and rustic garlic mash.",
    price: 1650,
    categorySlug: "steaks",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Luxury Choice", "Prime Beef"]
  },
  {
    id: "menu_4",
    name: "The East Junction Truffle Pizza",
    description: "Ancient wood-fired sourdough hand-tossed crust, dynamic buffalo milk mozzarella pearls, roasted baby cherry tomatoes, finished with rich drizzle of white truffle oil.",
    price: 1450,
    categorySlug: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Stone-baked", "Truffle Oil"]
  },
  {
    id: "menu_5",
    name: "Imperial Saffron Biryani",
    description: "Aromatic kettle-cooked recipe using premium aged Basmati. Infused with natural saffron, rich spice bouquets, juicy hand-cut mutton cubes, and crispy gold onions.",
    price: 1250,
    categorySlug: "biryani",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Heritage", "Spicy"]
  },
  {
    id: "menu_6",
    name: "Chicken Mushroom Fettuccine",
    description: "Fresh egg-fettuccine pasta spun in standard parmesan reduction, sliced oven-herbed chicken breast, and wild pan-fried cremini mushrooms.",
    price: 1150,
    categorySlug: "pasta",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Creamy", "Italian Style"]
  },
  {
    id: "menu_7",
    name: "Szechuan Glazed Chilli Chicken",
    description: "Double-cooked crispy organic chicken cubes tossed with charred Szechuan red chiles, scallion roots, honey reduction, and sesame dust.",
    price: 1250,
    categorySlug: "chinese",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    tags: ["Spicy Accent"]
  },
  {
    id: "menu_8",
    name: "Beef Steak Burger",
    description: "Thin-shaved tenderloin steak flash-sautéed with bell peppers and melted provolone cheese, served on a toasted sourdough roll with house steak-sauce glaze.",
    price: 950,
    categorySlug: "burgers",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Gourmet Blend"]
  },
  {
    id: "menu_9",
    name: "Mint Lemonade Spritzer",
    description: "Muddled cool mint sprigs and organic swirled lime wedges, raw wild blossom honey, fine gray rock salt, and ice-cold mountain carbonated spring water.",
    price: 350,
    categorySlug: "drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Refresher", "Ice Cold"]
  },
  {
    id: "menu_10",
    name: "24K Gold Saffron Kulfi",
    description: "Traditional slow-reduced dense clotted-cream ice, infused with true grade-A saffron strings and green cardamom seeds, glazed with real edible golden foil shards.",
    price: 550,
    categorySlug: "desserts",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    tags: ["Gold Plated", "Signature Dessert"]
  }
];

const defaultBirthdayEvents = [
  {
    id: "event_1",
    name: "Royal Platinum Celebration",
    description: "Our signature luxury birthday program designed for VIP hosting, customized to offer the ultimate aesthetic impact with high-end luxury details.",
    pricePerPerson: 4500,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Exclusive access to the Private VIP Dining Lounge at Spogmai Plaza",
      "High-contrast fresh flower ceiling backdrops and premium gold archways",
      "Assorted 3-Tier Customized Fondant Celebration Cake",
      "Elite 4-course bespoke menu (Appetizer, Platters, Artisan Drinks, Saffron Desserts)",
      "Complimentary live table-side violinist for ambient sets",
      "Dedicated VIP service coordinators and complimentary professional photography"
    ],
    popular: true
  },
  {
    id: "event_2",
    name: "Golden Jubilee Banquet",
    description: "Beautiful celebratory layout ideal for warm, joyful, and luxury-filled family birthday gatherings and corporate celebrations.",
    pricePerPerson: 3000,
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Reserved semi-private wing area beautifully styled with custom candlelight arrangements",
      "Dynamic 2-Tier Signature Red Velvet or Chocolate Fudge cake",
      "Crafted 3-course menu including Signature Burgers and Chinese Glazed Specialities",
      "Premium immersive surround audio player output customizable to user taste",
      "Bespoke gold-foiled dynamic table name cards"
    ],
    popular: false
  },
  {
    id: "event_3",
    name: "Elite Birthday High-Tea",
    description: "Sophisticated social or professional afternoon birthday event focused on a lighter, highly chic presentation style.",
    pricePerPerson: 1800,
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Luxury styled high-tea buffet station with gold server towers",
      "Bespoke mini gourmet burger sliders and assorted miniature woodfired flatbreads",
      "Free-flowing glass Mint Lemonade spritzers & specialty brewed French-press coffees",
      "Elegantly themed table centerpiece bouquets and light background jazz"
    ],
    popular: false
  }
];

const defaultReviews = [
  {
    id: "rev_1",
    name: "Ayesha Khan",
    email: "ayesha.khan@peshawarcritics.com",
    role: "Peshawar Food Critic",
    rating: 5,
    comment: "An absolute masterclass in luxury dining. The Tarragon Grilled Steak is perfectly tender and seasoned to gourmet standards. The glassmorphic golden interior makes you feel like you are in London or Dubai. Spogmai Plaza has truly found its jewel.",
    message: "An absolute masterclass in luxury dining. The Tarragon Grilled Steak is perfectly tender and seasoned to gourmet standards. The glassmorphic golden interior makes you feel like you are in London or Dubai. Spogmai Plaza has truly found its jewel.",
    date: "2026-06-12",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    isApproved: true,
    status: "approved"
  },
  {
    id: "rev_2",
    name: "Dr. Bilal Ahmed",
    email: "bilal.ahmed@gmail.com",
    role: "Regular Family Guest",
    rating: 5,
    comment: "The East Junction is Peshawar's finest spot for family dinners. Outstanding service, secure family environment, and generous portion sizes. The Turkish Platter is exceptionally juicy and easily feeds our heavy table group. 10/10!",
    message: "The East Junction is Peshawar's finest spot for family dinners. Outstanding service, secure family environment, and generous portion sizes. The Turkish Platter is exceptionally juicy and easily feeds our heavy table group. 10/10!",
    date: "2026-06-15",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    isApproved: true,
    status: "approved"
  },
  {
    id: "rev_3",
    name: "Zubair Afridi",
    email: "zubair.afridi@gmail.com",
    role: "Corporate Lead Guide",
    rating: 5,
    comment: "Phenomenal layout for corporate gatherings! We booked the Royal Platinum Birthday setup for our director's surprise and the precision in flowers, food presentation, and live music blew everyone away. Customer service is fantastic.",
    message: "Phenomenal layout for corporate gatherings! We booked the Royal Platinum Birthday setup for our director's surprise and the precision in flowers, food presentation, and live music blew everyone away. Customer service is fantastic.",
    date: "2026-06-16",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    isApproved: true,
    status: "approved"
  }
];

const defaultGallery = [
  {
    id: "gal_1",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    title: "Luxury Dining Under Saffron Chandeliers",
    category: "interior"
  },
  {
    id: "gal_2",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    title: "The Sovereign Sizzling Turkish Platter",
    category: "dishes"
  },
  {
    id: "gal_3",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    title: "Platinum Birthday Suite Arrangement",
    category: "events"
  },
  {
    id: "gal_4",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    title: "Barista Crafted Golden Honey Latte",
    category: "drinks"
  },
  {
    id: "gal_5",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    title: "Our Signature Gourmet Dripping Cheese Burger",
    category: "dishes"
  },
  {
    id: "gal_6",
    url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
    title: "Modern Ambient Coffee Lounge",
    category: "interior"
  }
];

const defaultReservations = [
  {
    id: "res_1",
    name: "Sameer Lodhi",
    email: "sameer.lodhi@gmail.com",
    phone: "0333-9123456",
    date: "2026-06-19",
    time: "20:30",
    guests: 6,
    specialRequest: "Near the window for a family anniversary celebrate, request the violin player if available.",
    status: "confirmed"
  },
  {
    id: "res_2",
    name: "Mariam Shah",
    email: "mariam.shah@yahoo.com",
    phone: "0300-5840011",
    date: "2026-06-20",
    time: "19:00",
    guests: 15,
    specialRequest: "Golden Jubilee Birthday package event booking. Expecting custom flower table layouts.",
    status: "pending"
  }
];

const defaultMessages = [
  {
    id: "msg_1",
    name: "Kamran Bangash",
    email: "kamran.b@nexus.com.pk",
    phone: "0312-5551122",
    subject: "Corporate Catering Services Inquiries",
    message: "Hello! We would like to inquire about hosting a corporate dinner for 40 executives next Tuesday evening. Do you offer set-menu catering customizations and can we project visual files in the lounge? Kindly call back on my number.",
    date: "2026-06-16",
    isRead: false
  }
];

const defaultSettings = {
  restaurantName: "The East Junction",
  location: "Spogmai Plaza, Near Avon Super Store, University Road, Peshawar, Pakistan",
  phone: "091-5840011",
  email: "info@theeastjunction.com",
  whatsapp: "92915840011",
  instagramUser: "theeastjunction",
  mapUrl: "https://maps.google.com/?q=Spogmai+Plaza+University+Road+Peshawar"
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/east_junction");
    console.log("MongoDB Connected for seeding...");

    // Clear existing collections
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Gallery.deleteMany({});
    await Message.deleteMany({});
    await RestaurantSetting.deleteMany({});
    await Reservation.deleteMany({});
    await BirthdayEvent.deleteMany({});

    console.log("Collections cleared successfully.");

    // Seed Admin (Username: Mati Ur Rehman, Password: Sasuke Uchiha)
    const adminUser = new Admin({
      username: "Mati Ur Rehman",
      password: "Sasuke Uchiha"
    });
    await adminUser.save();
    console.log("Admin seeded successfully.");

    // Seed other collections
    await Category.insertMany(defaultCategories);
    console.log("Categories seeded.");

    await MenuItem.insertMany(defaultMenuItems);
    console.log("Menu items seeded.");

    await BirthdayEvent.insertMany(defaultBirthdayEvents);
    console.log("Birthday events seeded.");

    await Review.insertMany(defaultReviews);
    console.log("Reviews seeded.");

    await Gallery.insertMany(defaultGallery);
    console.log("Gallery images seeded.");

    await Reservation.insertMany(defaultReservations);
    console.log("Reservations seeded.");

    await Message.insertMany(defaultMessages);
    console.log("Messages seeded.");

    await RestaurantSetting.create(defaultSettings);
    console.log("Settings seeded.");

    console.log("Database seeded successfully with all premium values!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database: ", error);
    process.exit(1);
  }
};

seedDB();
