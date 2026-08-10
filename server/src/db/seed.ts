import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "#app/db/schema/index.js";
import { hashPassword } from "#app/utils/crypto.js";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required");
}

const client = postgres(url, { prepare: false });
const db = drizzle(client, { schema });

const {
  users,
  userRoles,
  subscriptionPlans,
  subscriptions,
  payments,
  properties,
  propertyImages,
  wishlists,
  hotels,
  hotelImages,
  hotelBookings,
  hotelReviews,
  artisanProfiles,
  artisanHireRequests,
  artisanReviews,
  propertyInquiries,
  artisanInquiries,
  posts,
  postImages,
  postLikes,
  postComments,
  postShares,
  savedPosts,
  stories,
  storyViews,
  follows,
  notifications,
  userNotificationPreferences,
  conversations,
  conversationParticipants,
  messages,
} = schema;

/** Real (if generic) photography via Lorem Picsum, seeded so each slug always
 * resolves to the same image — no API key, no rate limit, guaranteed to load. */
function img(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/** randomuser.me serves real (model-released) portrait photography, 0-99 per gender. */
function avatar(gender: "men" | "women", n: number): string {
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
}

const SEED_PASSWORD = "Password123!";

async function clearExisting() {
  console.log("Clearing existing seed data...");
  await db.delete(messages);
  await db.delete(conversationParticipants);
  await db.delete(conversations);
  await db.delete(notifications);
  await db.delete(userNotificationPreferences);
  await db.delete(follows);
  await db.delete(savedPosts);
  await db.delete(postShares);
  await db.delete(postComments);
  await db.delete(postLikes);
  await db.delete(postImages);
  await db.delete(posts);
  await db.delete(storyViews);
  await db.delete(stories);
  await db.delete(artisanInquiries);
  await db.delete(propertyInquiries);
  await db.delete(artisanReviews);
  await db.delete(artisanHireRequests);
  await db.delete(hotelBookings);
  await db.delete(hotelReviews);
  await db.delete(hotelImages);
  await db.delete(hotels);
  await db.delete(wishlists);
  await db.delete(propertyImages);
  await db.delete(properties);
  await db.delete(artisanProfiles);
  await db.delete(payments);
  await db.delete(subscriptions);
  await db.delete(subscriptionPlans);
  await db.delete(userRoles);
  await db.delete(users);
}

async function seedUsers() {
  console.log("Seeding users...");
  const passwordHash = await hashPassword(SEED_PASSWORD);

  const rows = await db
    .insert(users)
    .values([
      {
        firstname: "Ama",
        lastname: "Serwaa",
        email: "ama.serwaa@example.com",
        phone: "+233241000001",
        password_hash: passwordHash,
        profile_picture: avatar("women", 12),
        verified: true,
      },
      {
        firstname: "Kwame",
        lastname: "Mensah",
        email: "kwame.mensah@example.com",
        phone: "+233241000002",
        password_hash: passwordHash,
        profile_picture: avatar("men", 32),
        verified: true,
      },
      {
        firstname: "Kofi",
        lastname: "Owusu",
        email: "kofi.owusu@example.com",
        phone: "+233241000003",
        password_hash: passwordHash,
        profile_picture: avatar("men", 45),
        verified: true,
      },
      {
        firstname: "Efua",
        lastname: "Boateng",
        email: "efua.boateng@example.com",
        phone: "+233241000004",
        password_hash: passwordHash,
        profile_picture: avatar("women", 21),
        verified: true,
      },
      {
        firstname: "Yaw",
        lastname: "Asante",
        email: "yaw.asante@example.com",
        phone: "+233241000005",
        password_hash: passwordHash,
        profile_picture: avatar("men", 51),
        verified: true,
      },
      {
        firstname: "Abena",
        lastname: "Osei",
        email: "abena.osei@example.com",
        phone: "+233241000006",
        password_hash: passwordHash,
        profile_picture: avatar("women", 38),
        verified: true,
      },
      {
        firstname: "Nana",
        lastname: "Adjei",
        email: "nana.adjei@example.com",
        phone: "+233241000007",
        password_hash: passwordHash,
        profile_picture: avatar("men", 63),
        verified: true,
      },
      {
        firstname: "Yaw",
        lastname: "Boateng",
        email: "yaw.boateng@example.com",
        phone: "+233241000008",
        password_hash: passwordHash,
        profile_picture: avatar("men", 8),
        verified: true,
      },
      {
        firstname: "Comfort",
        lastname: "Darko",
        email: "comfort.darko@example.com",
        phone: "+233241000009",
        password_hash: passwordHash,
        profile_picture: avatar("women", 55),
        verified: true,
      },
      {
        firstname: "Akosua",
        lastname: "Frimpong",
        email: "akosua.frimpong@example.com",
        phone: "+233241000010",
        password_hash: passwordHash,
        profile_picture: avatar("women", 65),
        verified: true,
      },
      {
        firstname: "Kojo",
        lastname: "Appiah",
        email: "kojo.appiah@example.com",
        phone: "+233241000011",
        password_hash: passwordHash,
        profile_picture: avatar("men", 71),
        verified: true,
      },
      {
        firstname: "Festari",
        lastname: "Admin",
        email: "admin@festari.com",
        phone: "+233241000012",
        password_hash: passwordHash,
        profile_picture: avatar("men", 5),
        verified: true,
      },
    ])
    .returning({ id: users.id, email: users.email });

  const byEmail = Object.fromEntries(rows.map((r) => [r.email, r.id])) as Record<string, string>;

  const roleRows: { user_id: string; role: (typeof userRoles.$inferInsert)["role"] }[] = [
    { user_id: byEmail["ama.serwaa@example.com"]!, role: "buyer" },
    { user_id: byEmail["kwame.mensah@example.com"]!, role: "buyer" },
    { user_id: byEmail["kwame.mensah@example.com"]!, role: "artisan" },
    { user_id: byEmail["kofi.owusu@example.com"]!, role: "estate_manager" },
    { user_id: byEmail["efua.boateng@example.com"]!, role: "estate_manager" },
    { user_id: byEmail["yaw.asante@example.com"]!, role: "hotel_manager" },
    { user_id: byEmail["abena.osei@example.com"]!, role: "artisan" },
    { user_id: byEmail["nana.adjei@example.com"]!, role: "artisan" },
    { user_id: byEmail["yaw.boateng@example.com"]!, role: "artisan" },
    { user_id: byEmail["comfort.darko@example.com"]!, role: "artisan" },
    { user_id: byEmail["akosua.frimpong@example.com"]!, role: "buyer" },
    { user_id: byEmail["kojo.appiah@example.com"]!, role: "hotel_manager" },
    { user_id: byEmail["kojo.appiah@example.com"]!, role: "buyer" },
    { user_id: byEmail["admin@festari.com"]!, role: "admin" },
  ];
  await db.insert(userRoles).values(roleRows);

  return {
    ama: byEmail["ama.serwaa@example.com"]!,
    kwame: byEmail["kwame.mensah@example.com"]!,
    kofi: byEmail["kofi.owusu@example.com"]!,
    efua: byEmail["efua.boateng@example.com"]!,
    yaw: byEmail["yaw.asante@example.com"]!,
    abena: byEmail["abena.osei@example.com"]!,
    nana: byEmail["nana.adjei@example.com"]!,
    yawBoateng: byEmail["yaw.boateng@example.com"]!,
    comfort: byEmail["comfort.darko@example.com"]!,
    akosua: byEmail["akosua.frimpong@example.com"]!,
    kojo: byEmail["kojo.appiah@example.com"]!,
    admin: byEmail["admin@festari.com"]!,
  };
}

async function seedSubscriptions(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding subscription plans, subscriptions, and payments...");

  const planValues: (typeof subscriptionPlans.$inferInsert)[] = [
      {
        name: "Starter",
        description: { features: ["5 property listings", "1 hotel listing", "10 images per listing"] },
        interval: "monthly",
        amount: "50",
        amount_saved: 0,
        plan_code: "PLN_starter_monthly",
        max_properties: 5,
        max_hotels: 1,
        max_images: 10,
        max_videos: 2,
        can_feature_properties: false,
      },
      {
        name: "Growth",
        description: {
          features: ["20 property listings", "5 hotel listings", "Featured listings", "20 images per listing"],
        },
        interval: "monthly",
        amount: "150",
        amount_saved: 0,
        plan_code: "PLN_growth_monthly",
        max_properties: 20,
        max_hotels: 5,
        max_images: 20,
        max_videos: 5,
        can_feature_properties: true,
      },
      {
        name: "Business",
        description: {
          features: ["Unlimited-scale listings", "Priority support", "Featured listings", "50 images per listing"],
        },
        interval: "yearly",
        amount: "1500",
        amount_saved: 300,
        plan_code: "PLN_business_yearly",
        max_properties: 100,
        max_hotels: 20,
        max_images: 50,
        max_videos: 15,
        can_feature_properties: true,
      },
    ];

  const [starter, growth, business] = await db
    .insert(subscriptionPlans)
    .values(planValues)
    .returning({ id: subscriptionPlans.id, plan_code: subscriptionPlans.plan_code });

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [kofiSub, yawSub] = await db
    .insert(subscriptions)
    .values([
      {
        user_id: userIds.kofi,
        plan_id: growth!.id,
        plan_code: growth!.plan_code,
        subscription_code: "SUB_kofi_growth",
        status: "active",
        started_at: now,
        expires_at: in30Days,
        auto_renewing: true,
      },
      {
        user_id: userIds.yaw,
        plan_id: starter!.id,
        plan_code: starter!.plan_code,
        subscription_code: "SUB_yaw_starter",
        status: "active",
        started_at: now,
        expires_at: in30Days,
        auto_renewing: true,
      },
    ])
    .returning({ id: subscriptions.id, user_id: subscriptions.user_id });

  const paymentValues: (typeof payments.$inferInsert)[] = [
    {
      user_id: userIds.kofi,
      payment_type: "subscription",
      target_id: kofiSub!.id,
      amount: "150",
      reference: "SEED_PAY_kofi_sub_001",
      status: "success",
      paid_at: now,
    },
    {
      user_id: userIds.yaw,
      payment_type: "subscription",
      target_id: yawSub!.id,
      amount: "50",
      reference: "SEED_PAY_yaw_sub_001",
      status: "success",
      paid_at: now,
    },
  ];
  await db.insert(payments).values(paymentValues);

  return { starterId: starter!.id, growthId: growth!.id, businessId: business!.id };
}

async function seedProperties(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding properties...");

  const propertyValues: (typeof properties.$inferInsert)[] = [
      {
        owner_id: userIds.kofi,
        title: "4 Bedroom Detached House",
        description: "Newly built, gated community with 24/7 security, East Legon.",
        price: "3450000",
        location: "East Legon, Accra",
        listing_type: "for_sale",
        property_type: "home",
        bedrooms: 4,
        bathrooms: 4,
        area_sqm: 420,
        is_featured: true,
        status: "approved",
      },
      {
        owner_id: userIds.efua,
        title: "3 Bedroom Apartment with Pool",
        description: "Fully furnished, shared pool and gym, walking distance to the airport.",
        price: "8000",
        location: "Airport Residential Area, Accra",
        listing_type: "for_rent",
        property_type: "apartment",
        bedrooms: 3,
        bathrooms: 3,
        area_sqm: 210,
        status: "approved",
      },
      {
        owner_id: userIds.kofi,
        title: "5 Bedroom Executive Mansion",
        description: "Executive mansion with a private garden and staff quarters.",
        price: "5200000",
        location: "Trasacco Valley, Accra",
        listing_type: "for_sale",
        property_type: "home",
        bedrooms: 5,
        bathrooms: 6,
        area_sqm: 650,
        is_featured: true,
        status: "approved",
      },
      {
        owner_id: userIds.efua,
        title: "2 Bedroom Apartment",
        description: "Modern finishing, close to the Spintex road shopping strip.",
        price: "3500",
        location: "Spintex, Accra",
        listing_type: "for_rent",
        property_type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area_sqm: 95,
        status: "approved",
      },
      {
        owner_id: userIds.kofi,
        title: "Prime Commercial Land",
        description: "Registered title, ready for immediate development.",
        price: "450000",
        location: "Oyibi, Accra",
        listing_type: "for_sale",
        property_type: "land",
        area_sqm: 1000,
        status: "approved",
      },
      {
        owner_id: userIds.efua,
        title: "Modern Office Space",
        description: "Open-plan office floor, backup power, ample parking.",
        price: "12000",
        location: "Airport City, Accra",
        listing_type: "for_rent",
        property_type: "office",
        area_sqm: 300,
        status: "approved",
      },
      {
        owner_id: userIds.kofi,
        title: "3 Bedroom Townhouse",
        description: "Family-friendly gated estate with a shared playground.",
        price: "1850000",
        location: "Ashaley Botwe, Accra",
        listing_type: "for_sale",
        property_type: "home",
        bedrooms: 3,
        bathrooms: 3,
        area_sqm: 260,
        status: "approved",
      },
      {
        owner_id: userIds.efua,
        title: "Cozy Studio Apartment",
        description: "Compact and stylish, perfect for a young professional.",
        price: "2200",
        location: "Osu, Accra",
        listing_type: "for_rent",
        property_type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        area_sqm: 45,
        status: "approved",
      },
      {
        owner_id: userIds.kofi,
        title: "6 Bedroom Family Home",
        description: "Spacious family home with a large compound, near KNUST.",
        price: "2900000",
        location: "Ridge, Kumasi",
        listing_type: "for_sale",
        property_type: "home",
        bedrooms: 6,
        bathrooms: 5,
        area_sqm: 500,
        status: "pending",
      },
      {
        owner_id: userIds.efua,
        title: "Short Stay 2 Bedroom Apartment",
        description: "Serviced apartment, ideal for weekend getaways in Labone.",
        price: "450",
        location: "Labone, Accra",
        listing_type: "short_stay",
        property_type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area_sqm: 110,
        is_featured: true,
        status: "approved",
      },
      {
        owner_id: userIds.efua,
        title: "Unverified Roadside Plot",
        description: "Listing submitted without full documentation — rejected pending resubmission.",
        price: "90000",
        location: "Adenta, Accra",
        listing_type: "for_sale",
        property_type: "land",
        area_sqm: 400,
        status: "rejected",
      },
    ];

  const rows = await db
    .insert(properties)
    .values(propertyValues)
    .returning({ id: properties.id, title: properties.title });

  const imageValues = rows.flatMap((property, i) => [
    { property_id: property.id, image_url: img(`festari-property-${i}-a`), position: 0 },
    { property_id: property.id, image_url: img(`festari-property-${i}-b`), position: 1 },
    { property_id: property.id, image_url: img(`festari-property-${i}-c`), position: 2 },
  ]);
  await db.insert(propertyImages).values(imageValues);

  await db.insert(wishlists).values([
    { user_id: userIds.ama, property_id: rows[0]!.id },
    { user_id: userIds.ama, property_id: rows[2]!.id },
    { user_id: userIds.akosua, property_id: rows[9]!.id },
  ]);

  return rows;
}

async function seedHotels(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding hotels and bookings...");

  const hotelValues: (typeof hotels.$inferInsert)[] = [
      {
        owner_id: userIds.yaw,
        name: "The Palm Garden Hotel",
        description: "Boutique hotel with a rooftop lounge, East Legon.",
        location: "East Legon, Accra",
        amenities: { wifi: true, pool: true, parking: true, gym: true },
        price_per_night: "850",
        category: "hotel",
        rooms: 40,
        status: "approved",
      },
      {
        owner_id: userIds.yaw,
        name: "Aqua Bliss Beach Resort",
        description: "Beachfront resort with private cabanas and a spa.",
        location: "Labadi, Accra",
        amenities: { wifi: true, pool: true, beach_access: true, spa: true },
        price_per_night: "1200",
        category: "resort",
        rooms: 60,
        status: "approved",
      },
      {
        owner_id: userIds.kojo,
        name: "Ridge View Hotel",
        description: "City-view rooms, conference facilities, free breakfast.",
        location: "Ridge, Kumasi",
        amenities: { wifi: true, breakfast: true, conference_room: true },
        price_per_night: "650",
        category: "hotel",
        rooms: 35,
        status: "approved",
      },
      {
        owner_id: userIds.kojo,
        name: "Savannah Comfort Inn",
        description: "Budget-friendly short stays with a courtyard restaurant.",
        location: "Tamale",
        amenities: { wifi: true, restaurant: true, parking: true },
        price_per_night: "400",
        category: "short_stay",
        rooms: 20,
        status: "approved",
      },
      {
        owner_id: userIds.yaw,
        name: "Volta Breeze Hotel",
        description: "Lakeside views, newly opened, still under admin review.",
        location: "Akosombo",
        amenities: { wifi: true, lake_view: true },
        price_per_night: "550",
        category: "hotel",
        rooms: 15,
        status: "pending",
      },
      {
        owner_id: userIds.kojo,
        name: "Airport City Executive Suites",
        description: "Fully serviced executive apartments near the airport.",
        location: "Airport Residential Area, Accra",
        amenities: { wifi: true, parking: true, gym: true },
        price_per_night: "700",
        category: "apartment",
        rooms: 12,
        status: "approved",
      },
      {
        owner_id: userIds.yaw,
        name: "The Grand Terrace Events",
        description: "Open-air event space for weddings, launches, and conferences.",
        location: "East Legon, Accra",
        amenities: { wifi: true, parking: true },
        price_per_night: "5000",
        category: "event_venue",
        status: "approved",
      },
    ];

  const rows = await db
    .insert(hotels)
    .values(hotelValues)
    .returning({ id: hotels.id, name: hotels.name });

  const imageValues = rows.flatMap((hotel, i) => [
    { hotel_id: hotel.id, image_url: img(`festari-hotel-${i}-a`), position: 0 },
    { hotel_id: hotel.id, image_url: img(`festari-hotel-${i}-b`), position: 1 },
  ]);
  await db.insert(hotelImages).values(imageValues);

  const today = new Date();
  function daysFromNow(n: number) {
    return new Date(today.getTime() + n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  const bookingValues: (typeof hotelBookings.$inferInsert)[] = [
    {
      hotel_id: rows[0]!.id,
      user_id: userIds.ama,
      check_in: daysFromNow(14),
      check_out: daysFromNow(17),
      guests: 2,
      status: "confirmed",
      total_price: "2550",
    },
    {
      hotel_id: rows[1]!.id,
      user_id: userIds.akosua,
      check_in: daysFromNow(30),
      check_out: daysFromNow(33),
      guests: 4,
      status: "pending",
      total_price: "3600",
    },
    {
      hotel_id: rows[2]!.id,
      user_id: userIds.kwame,
      check_in: daysFromNow(-10),
      check_out: daysFromNow(-7),
      guests: 1,
      status: "completed",
      total_price: "1950",
    },
  ];
  await db.insert(hotelBookings).values(bookingValues);

  await db.insert(hotelReviews).values([
    { hotel_id: rows[0]!.id, reviewer_id: userIds.ama, rating: 5, comment: "Spotless rooms and a great rooftop view." },
    { hotel_id: rows[0]!.id, reviewer_id: userIds.akosua, rating: 4, comment: "Comfortable stay, breakfast could be better." },
    { hotel_id: rows[1]!.id, reviewer_id: userIds.kwame, rating: 5, comment: "The beach access alone is worth it." },
    { hotel_id: rows[1]!.id, reviewer_id: userIds.efua, rating: 5, comment: "Best resort weekend we've had in Accra." },
    { hotel_id: rows[2]!.id, reviewer_id: userIds.kofi, rating: 4, comment: "Great views, solid conference setup." },
    { hotel_id: rows[3]!.id, reviewer_id: userIds.abena, rating: 4, comment: "Good value for a short stay." },
    { hotel_id: rows[5]!.id, reviewer_id: userIds.nana, rating: 5, comment: "Felt like a real home away from home." },
    { hotel_id: rows[6]!.id, reviewer_id: userIds.kojo, rating: 5, comment: "Hosted our launch here, flawless space." },
  ]);

  return rows;
}

async function seedArtisans(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding artisan profiles, hire requests, and reviews...");

  await db.insert(artisanProfiles).values([
    {
      id: userIds.kwame,
      service_type: "electrical",
      bio: "10+ years wiring homes and offices across Accra. Licensed and insured.",
      location: "Accra",
      status: "approved",
    },
    {
      id: userIds.abena,
      service_type: "plumbing",
      bio: "Specialist in leak repairs, fixture installs, and bathroom renovations.",
      location: "Accra",
      status: "approved",
    },
    {
      id: userIds.nana,
      service_type: "painting",
      bio: "Interior and exterior painting, clean finish, fast turnaround.",
      location: "Kumasi",
      status: "approved",
    },
    {
      id: userIds.yawBoateng,
      service_type: "carpentry",
      bio: "Custom furniture, built-in wardrobes, and kitchen cabinetry.",
      location: "Tema",
      status: "approved",
    },
    {
      id: userIds.comfort,
      service_type: "interior_design",
      bio: "Full-service interior design for homes and short-let apartments.",
      location: "Accra",
      status: "pending",
    },
  ]);

  const hireRows = await db
    .insert(artisanHireRequests)
    .values([
      {
        artisan_id: userIds.abena,
        requester_id: userIds.ama,
        message: "Hi, I have a leaking kitchen sink — are you free this week?",
        status: "accepted",
      },
      {
        artisan_id: userIds.kwame,
        requester_id: userIds.akosua,
        message: "Need a full rewire quote for a 3 bedroom apartment.",
        status: "completed",
      },
      {
        artisan_id: userIds.nana,
        requester_id: userIds.ama,
        message: "Looking to repaint the living room and hallway.",
        status: "pending",
      },
    ])
    .returning({ id: artisanHireRequests.id });

  await db.insert(artisanReviews).values([
    { artisan_id: userIds.kwame, reviewer_id: userIds.akosua, rating: 5, comment: "Fixed it in 20 minutes, great work." },
    { artisan_id: userIds.kwame, reviewer_id: userIds.ama, rating: 4, comment: "Professional and punctual." },
    { artisan_id: userIds.abena, reviewer_id: userIds.ama, rating: 5, comment: "Very thorough, would hire again." },
    { artisan_id: userIds.abena, reviewer_id: userIds.akosua, rating: 4, comment: "Solid work, fair pricing." },
    { artisan_id: userIds.nana, reviewer_id: userIds.kwame, rating: 5, comment: "Beautiful finish, highly recommend." },
    { artisan_id: userIds.yawBoateng, reviewer_id: userIds.efua, rating: 5, comment: "Incredible attention to detail." },
    { artisan_id: userIds.yawBoateng, reviewer_id: userIds.kofi, rating: 3, comment: "Good work but ran a day late." },
  ]);

  return hireRows;
}

async function seedInquiries(
  userIds: Awaited<ReturnType<typeof seedUsers>>,
  propertyRows: Awaited<ReturnType<typeof seedProperties>>,
) {
  console.log("Seeding property and artisan inquiries...");

  await db.insert(propertyInquiries).values([
    {
      property_id: propertyRows[0]!.id,
      user_id: userIds.akosua,
      name: "Akosua Frimpong",
      email: "akosua.frimpong@example.com",
      phone: "+233241000010",
      message: "Is this property still available? I'd like to schedule a viewing.",
      is_read: true,
    },
    {
      property_id: propertyRows[1]!.id,
      user_id: null,
      name: "Prince Owusu",
      email: "prince.owusu@example.com",
      phone: "+233208887777",
      message: "Does the rent include utilities?",
      is_read: false,
    },
    {
      property_id: propertyRows[9]!.id,
      user_id: userIds.kwame,
      name: "Kwame Mensah",
      email: "kwame.mensah@example.com",
      message: "Looking for a short stay next weekend, is it booked?",
      is_read: false,
    },
  ]);

  await db.insert(artisanInquiries).values([
    {
      artisan_id: userIds.yawBoateng,
      user_id: userIds.efua,
      name: "Efua Boateng",
      email: "efua.boateng@example.com",
      phone: "+233241000004",
      message: "Do you build custom kitchen cabinets for rental units?",
      is_read: true,
    },
    {
      artisan_id: userIds.comfort,
      user_id: null,
      name: "Linda Appiah",
      email: "linda.appiah@example.com",
      message: "Do you handle full apartment styling for Airbnb listings?",
      is_read: false,
    },
  ]);
}

async function seedFeed(
  userIds: Awaited<ReturnType<typeof seedUsers>>,
  propertyRows: Awaited<ReturnType<typeof seedProperties>>,
  hotelRows: Awaited<ReturnType<typeof seedHotels>>,
) {
  console.log("Seeding stories, posts, and interactions...");

  const in24h = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);

  const storyRows = await db
    .insert(stories)
    .values([
      { author_id: userIds.efua, media_url: img("festari-story-1", 720, 1280), caption: "House hunting all weekend", expires_at: in24h(20) },
      { author_id: userIds.kofi, media_url: img("festari-story-2", 720, 1280), caption: "New listing walkthrough", expires_at: in24h(18) },
      { author_id: userIds.kwame, media_url: img("festari-story-3", 720, 1280), caption: "On site rewiring a client's home", expires_at: in24h(15) },
      { author_id: userIds.yaw, media_url: img("festari-story-4", 720, 1280), caption: "Sunset from the rooftop lounge", expires_at: in24h(22) },
      { author_id: userIds.ama, media_url: img("festari-story-5", 720, 1280), caption: "Apartment tour vibes", expires_at: in24h(10) },
    ])
    .returning({ id: stories.id });

  await db.insert(storyViews).values([
    { story_id: storyRows[0]!.id, viewer_id: userIds.ama },
    { story_id: storyRows[0]!.id, viewer_id: userIds.akosua },
    { story_id: storyRows[1]!.id, viewer_id: userIds.ama },
  ]);

  const postRows = await db
    .insert(posts)
    .values([
      {
        author_id: userIds.kofi,
        kind: "property",
        body: "Just listed this beautiful 4 bedroom house in East Legon. Gated community, 24/7 security, move-in ready!",
        hashtags: "#NewListing #EastLegon #ForSale #FestariEstates",
        linked_property_id: propertyRows[0]!.id,
      },
      {
        author_id: userIds.efua,
        kind: "property",
        body: "Fully furnished 3 bedroom apartment near the airport, available immediately. DM for a private tour.",
        hashtags: "#ForRent #AirportResidential #FestariEstates",
        linked_property_id: propertyRows[1]!.id,
      },
      {
        author_id: userIds.efua,
        kind: "property",
        body: "Weekend getaway sorted — serviced short stay apartment in Labone, sleeps 4.",
        hashtags: "#ShortStay #Labone #FestariEstates",
        linked_property_id: propertyRows[9]!.id,
      },
      {
        author_id: userIds.kwame,
        kind: "service",
        body: "Offering full home rewiring and electrical safety inspections across Accra. Licensed and insured — book a slot this month.",
        hashtags: "#Electrician #Accra #FestariServices",
        linked_artisan_id: userIds.kwame,
      },
      {
        author_id: userIds.abena,
        kind: "service",
        body: "Bathroom leaks, burst pipes, fixture installs — same-day plumbing callouts available in Accra.",
        hashtags: "#Plumber #Accra #FestariServices",
        linked_artisan_id: userIds.abena,
      },
      {
        author_id: userIds.nana,
        kind: "service",
        body: "Fresh coat, fresh start. Interior and exterior painting, clean finish guaranteed.",
        hashtags: "#Painter #Kumasi #FestariServices",
        linked_artisan_id: userIds.nana,
      },
      {
        author_id: userIds.ama,
        kind: "general",
        body: "Excited to be part of the Festari community! Looking forward to finding my first home here.",
        hashtags: "#FestariEstates #HouseHunting",
      },
      {
        author_id: userIds.akosua,
        kind: "general",
        body: "Any recommendations for a reliable interior designer in Accra? Redoing my living room this month.",
        hashtags: "#InteriorDesign #Accra",
      },
      {
        author_id: userIds.yaw,
        kind: "general",
        body: "Grateful for another 5-star review from a guest this week. Hospitality is a team effort!",
        hashtags: "#Hospitality #ThankYou",
      },
      {
        author_id: userIds.yaw,
        kind: "venue",
        body: "Book direct for the best rate — rooftop lounge, pool, and gym all included.",
        hashtags: "#EastLegon #Hotel #FestariStays",
        linked_hotel_id: hotelRows[0]!.id,
      },
      {
        author_id: userIds.yaw,
        kind: "venue",
        body: "Beachfront suites are open for the season — private cabanas, ocean views, spa on site.",
        hashtags: "#Labadi #Resort #FestariStays",
        linked_hotel_id: hotelRows[1]!.id,
      },
      {
        author_id: userIds.kojo,
        kind: "venue",
        body: "City-view rooms with full conference facilities — ideal for a business trip to Kumasi.",
        hashtags: "#Kumasi #Hotel #FestariStays",
        linked_hotel_id: hotelRows[2]!.id,
      },
      {
        author_id: userIds.kojo,
        kind: "venue",
        body: "Budget-friendly short stays two minutes from the Tamale market.",
        hashtags: "#Tamale #ShortStay #FestariStays",
        linked_hotel_id: hotelRows[3]!.id,
      },
      {
        author_id: userIds.kojo,
        kind: "venue",
        body: "Fully serviced executive apartments near the airport — great for a longer business stay.",
        hashtags: "#AirportResidential #Apartment #FestariStays",
        linked_hotel_id: hotelRows[5]!.id,
      },
      {
        author_id: userIds.yaw,
        kind: "venue",
        body: "Open-air event space for up to 300 guests — weddings, launches, and everything in between.",
        hashtags: "#EastLegon #EventVenue #FestariStays",
        linked_hotel_id: hotelRows[6]!.id,
      },
    ])
    .returning({ id: posts.id, kind: posts.kind, author_id: posts.author_id });

  const imagePosts = [postRows[0]!, postRows[1]!, postRows[2]!, postRows[6]!, postRows[9]!, postRows[10]!];
  const postImageValues = imagePosts.flatMap((post, i) => [
    { post_id: post.id, image_url: img(`festari-post-${i}-a`), position: 0 },
    { post_id: post.id, image_url: img(`festari-post-${i}-b`), position: 1 },
    { post_id: post.id, image_url: img(`festari-post-${i}-c`), position: 2 },
  ]);
  await db.insert(postImages).values(postImageValues);

  const allUserIds = Object.values(userIds);
  const likeValues = postRows.flatMap((post) =>
    allUserIds
      .filter((id) => id !== post.author_id)
      .slice(0, 4)
      .map((user_id) => ({ post_id: post.id, user_id })),
  );
  await db.insert(postLikes).values(likeValues);

  await db.insert(postComments).values([
    { post_id: postRows[0]!.id, author_id: userIds.akosua, body: "This looks amazing! Is it still available?" },
    { post_id: postRows[0]!.id, author_id: userIds.ama, body: "Love the location, East Legon is prime." },
    { post_id: postRows[3]!.id, author_id: userIds.efua, body: "Booked you for next Tuesday, thanks!" },
    { post_id: postRows[6]!.id, author_id: userIds.kofi, body: "Welcome to Festari, happy to help you find something." },
  ]);

  await db.insert(postShares).values([
    { post_id: postRows[0]!.id, user_id: userIds.akosua },
    { post_id: postRows[4]!.id, user_id: userIds.efua },
  ]);

  await db.insert(savedPosts).values([
    { post_id: postRows[0]!.id, user_id: userIds.ama },
    { post_id: postRows[2]!.id, user_id: userIds.akosua },
    { post_id: postRows[3]!.id, user_id: userIds.efua },
  ]);

  return postRows;
}

async function seedSocial(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding follows...");

  await db.insert(follows).values([
    { follower_id: userIds.ama, following_id: userIds.kofi },
    { follower_id: userIds.ama, following_id: userIds.efua },
    { follower_id: userIds.ama, following_id: userIds.kwame },
    { follower_id: userIds.akosua, following_id: userIds.kofi },
    { follower_id: userIds.akosua, following_id: userIds.abena },
    { follower_id: userIds.kwame, following_id: userIds.abena },
    { follower_id: userIds.kwame, following_id: userIds.nana },
    { follower_id: userIds.kofi, following_id: userIds.efua },
    { follower_id: userIds.efua, following_id: userIds.kofi },
    { follower_id: userIds.kojo, following_id: userIds.yaw },
  ]);
}

async function seedNotifications(
  userIds: Awaited<ReturnType<typeof seedUsers>>,
  postRows: Awaited<ReturnType<typeof seedFeed>>,
) {
  console.log("Seeding notifications...");

  await db.insert(notifications).values([
    {
      recipient_id: userIds.kofi,
      actor_id: userIds.akosua,
      verb: "like",
      target_type: "post",
      target_id: postRows[0]!.id,
      title: "New like on your post",
      body: "Akosua Frimpong liked your property listing.",
      is_read: false,
    },
    {
      recipient_id: userIds.kofi,
      actor_id: userIds.akosua,
      verb: "comment",
      target_type: "post",
      target_id: postRows[0]!.id,
      title: "New comment on your post",
      body: "Akosua Frimpong commented: \"This looks amazing! Is it still available?\"",
      is_read: false,
    },
    {
      recipient_id: userIds.kofi,
      actor_id: userIds.ama,
      verb: "follow",
      target_type: "user",
      target_id: userIds.ama,
      title: "New follower",
      body: "Ama Serwaa started following you.",
      is_read: true,
    },
    {
      recipient_id: userIds.kofi,
      actor_id: userIds.akosua,
      verb: "inquiry",
      target_type: "property",
      title: "New property inquiry",
      body: "Akosua Frimpong is interested in 4 Bedroom Detached House.",
      is_read: false,
    },
    {
      recipient_id: userIds.yaw,
      actor_id: userIds.ama,
      verb: "booking",
      target_type: "hotel_booking",
      title: "New hotel booking",
      body: "Ama Serwaa booked The Palm Garden Hotel for 3 nights.",
      is_read: false,
    },
    {
      recipient_id: userIds.abena,
      actor_id: userIds.ama,
      verb: "hire_request",
      target_type: "artisan_hire_request",
      title: "New hire request",
      body: "Ama Serwaa sent you a hire request for plumbing work.",
      is_read: true,
    },
  ]);

  await db.insert(userNotificationPreferences).values([
    { user_id: userIds.ama },
    { user_id: userIds.kofi },
    { user_id: userIds.kwame },
  ]);
}

async function seedMessaging(userIds: Awaited<ReturnType<typeof seedUsers>>) {
  console.log("Seeding conversations and messages...");

  const [convo1, convo2] = await db
    .insert(conversations)
    .values([{}, {}])
    .returning({ id: conversations.id });

  await db.insert(conversationParticipants).values([
    { conversation_id: convo1!.id, user_id: userIds.ama },
    { conversation_id: convo1!.id, user_id: userIds.kofi },
    { conversation_id: convo2!.id, user_id: userIds.akosua },
    { conversation_id: convo2!.id, user_id: userIds.abena },
  ]);

  await db.insert(messages).values([
    { conversation_id: convo1!.id, sender_id: userIds.ama, body: "Hi, is this property still available?", is_read: true },
    { conversation_id: convo1!.id, sender_id: userIds.kofi, body: "Yes it is! Would you like to schedule a viewing?", is_read: true },
    { conversation_id: convo1!.id, sender_id: userIds.ama, body: "Yes please, how about this Saturday?", is_read: false },
    { conversation_id: convo2!.id, sender_id: userIds.akosua, body: "Hi, do you have availability this week for a leak repair?", is_read: true },
    { conversation_id: convo2!.id, sender_id: userIds.abena, body: "Yes, I can come by Thursday morning.", is_read: false },
  ]);
}

async function main() {
  await clearExisting();

  const userIds = await seedUsers();
  await seedSubscriptions(userIds);
  const propertyRows = await seedProperties(userIds);
  const hotelRows = await seedHotels(userIds);
  await seedArtisans(userIds);
  await seedInquiries(userIds, propertyRows);
  const postRows = await seedFeed(userIds, propertyRows, hotelRows);
  await seedSocial(userIds);
  await seedNotifications(userIds, postRows);
  await seedMessaging(userIds);

  console.log("\nSeed complete.");
  console.log(`All seeded users share the password: ${SEED_PASSWORD}`);
  console.log("Sign in as, e.g.: admin@festari.com / kofi.owusu@example.com / ama.serwaa@example.com");
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end({ timeout: 5 });
  });
