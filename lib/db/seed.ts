import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, categories, products } from "./schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const CATEGORIES = [
  { nameKz: "Тамақ", icon: "🍔", color: "#FF6B35" },
  { nameKz: "Пицца", icon: "🍕", color: "#E55A26" },
  { nameKz: "Тұшпара", icon: "🥟", color: "#FFB800" },
  { nameKz: "Тәттілер", icon: "🍰", color: "#FF6B9D" },
  { nameKz: "Сусындар", icon: "🥤", color: "#22C55E" },
  { nameKz: "Бакалея", icon: "🛒", color: "#6366F1" },
  { nameKz: "Жемістер", icon: "🍎", color: "#F59E0B" },
  { nameKz: "Сүт өнімдері", icon: "🥛", color: "#3B82F6" },
];

const PRODUCTS = [
  { nameKz: "Класик Бургер", descriptionKz: "Шырынды табиғи ет котлеті, салат, помидор және арнайы соусымен", cat: "Тамақ", price: "2490", stock: 50, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { nameKz: "Ет бургері де люкс", descriptionKz: "Двойной котлет, чеддер ірімшігі, бекон және BBQ соусы", cat: "Тамақ", price: "3490", stock: 30, imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500" },
  { nameKz: "Маргарита пицца", descriptionKz: "Ыстық итальяндық пицца, помидор соусы, моцарелла, базилик", cat: "Пицца", price: "3200", stock: 20, imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500" },
  { nameKz: "Пепперони пицца", descriptionKz: "Классикалық пицца пепперони шұжығымен, бай ірімшік", cat: "Пицца", price: "3800", stock: 15, imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500" },
  { nameKz: "Ет тұшпарасы", descriptionKz: "Қолмен жасалған тұшпара жас сиыр еті мен шошқа ет қоспасымен", cat: "Тұшпара", price: "1800", stock: 40, imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500" },
  { nameKz: "Тауық тұшпарасы", descriptionKz: "Нәзік тауық еті мен дәмдеуіштер қосылған тұшпара", cat: "Тұшпара", price: "1600", stock: 35, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500" },
  { nameKz: "Шоколадты торт", descriptionKz: "Қою шоколадты торт, крем-ганаш, жеміс гарнирі", cat: "Тәттілер", price: "2200", stock: 10, imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
  { nameKz: "Тирамису", descriptionKz: "Итальяндық классикалық десерт, маскарпоне, кофе", cat: "Тәттілер", price: "1500", stock: 12, imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500" },
  { nameKz: "Апельсин фреш", descriptionKz: "Таза пресіктелген апельсин шырыны, 500мл", cat: "Сусындар", price: "890", stock: 60, imageUrl: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500" },
  { nameKz: "Ягодалы смузи", descriptionKz: "Таңқурай, ерік, бананнан дайындалған пайдалы смузи", cat: "Сусындар", price: "1100", stock: 45, imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500" },
  { nameKz: "Алма (1 кг)", descriptionKz: "Жергілікті Алматы алмасы, тәтті, хош иісті", cat: "Жемістер", price: "450", stock: 100, imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500" },
  { nameKz: "Банан (1 кг)", descriptionKz: "Дозиртелген эквадорлық банан", cat: "Жемістер", price: "690", stock: 80, imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500" },
  { nameKz: "Сиыр сүті 2.5%", descriptionKz: "Пастерланған сиыр сүті, 1 литр", cat: "Сүт өнімдері", price: "380", stock: 70, imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500" },
  { nameKz: "Тауық жұмыртқасы (10 дана)", descriptionKz: "Фермерлік тауық жұмыртқасы, 1 науаша", cat: "Бакалея", price: "520", stock: 90, imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500" },
];

async function seed() {
  console.log("Жеткізу сервисі — деректер енгізілуде...\n");

  const insertedCats = await db.insert(categories).values(CATEGORIES).returning();
  const catByName = Object.fromEntries(insertedCats.map(c => [c.nameKz, c.id]));
  console.log(`✓ ${insertedCats.length} санат қосылды`);

  const productValues = PRODUCTS.map(p => ({
    nameKz: p.nameKz,
    descriptionKz: p.descriptionKz,
    categoryId: catByName[p.cat] || null,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
  }));

  const insertedProducts = await db.insert(products).values(productValues).returning();
  console.log(`✓ ${insertedProducts.length} тауар қосылды`);

  const adminHash = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({ name: "Жеткізу Әкімшісі", email: "admin@delivery.kz", passwordHash: adminHash, role: "admin" });
  const customerHash = await bcrypt.hash("customer123", 10);
  await db.insert(users).values({ name: "Тест Тұтынушы", email: "customer@delivery.kz", passwordHash: customerHash });
  console.log("✓ 2 пайдаланушы қосылды");

  console.log("\n✅ Деректер сәтті енгізілді!");
  process.exit(0);
}

seed().catch(err => { console.error("Қате:", err); process.exit(1); });
