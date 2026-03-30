import { pgTable, serial, text, integer, timestamp, pgEnum, numeric, varchar } from "drizzle-orm/pg-core";

/**
 * Рөл enums:
 * - customer: қарапайым тапсырыс беруші
 * - admin: жүйе әкімшісі (тауар қосу/жою, тапсырыстарды басқару)
 */
export const roleEnum = pgEnum("delivery_role", ["customer", "admin"]);

/**
 * Тапсырыс күйлері:
 * - pending: өңделуде (жаңа тапсырыс)
 * - confirmed: расталды (дайындалуда)
 * - delivering: жеткізілуде
 * - delivered: жеткізілді
 * - cancelled: бас тартылды
 */
export const orderStatusEnum = pgEnum("delivery_order_status", [
  "pending", "confirmed", "delivering", "delivered", "cancelled"
]);

/** Жүйе пайдаланушылары */
export const users = pgTable("delivery_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Тауар санаттары */
export const categories = pgTable("delivery_categories", {
  id: serial("id").primaryKey(),
  nameKz: text("name_kz").notNull(),
  icon: text("icon"),       // emoji немесе icon аты
  color: text("color"),     // gradient үшін түс
});

/** Тауарлар */
export const products = pgTable("delivery_products", {
  id: serial("id").primaryKey(),
  nameKz: text("name_kz").notNull(),
  descriptionKz: text("description_kz"),
  categoryId: integer("category_id").references(() => categories.id),
  /** Тауар бағасы (тенге) */
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  /** Қолжетімді тауар саны */
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url"),
  isActive: integer("is_active").default(1).notNull(),
});

/** Тапсырыстар */
export const orders = pgTable("delivery_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  /** Барлық сомасы */
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  /** Жеткізу мекенжайы */
  deliveryAddress: text("delivery_address").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Тапсырыс элементтері (бір тапсырыстағы тауарлар) */
export const orderItems = pgTable("delivery_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  /** Сатып алынған саны */
  quantity: integer("quantity").notNull(),
  /** Тапсырыс берілген кездегі баға (өзгеруден қорғау үшін) */
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
