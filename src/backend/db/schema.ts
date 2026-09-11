import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  boolean,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  googleId: varchar('googleId', { length: 255 }).unique(),
  role: varchar('role', { length: 20 }).default('customer').notNull(),
  profileImage: varchar('profileImage', { length: 500 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  image: varchar('image', { length: 500 }),
  parentId: uuid('parentId'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  parentIdFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: 'categories_parentId_fk',
  }).onDelete('set null'),
}));

// Products table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('shortDescription', { length: 500 }),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  categoryId: uuid('categoryId').notNull(),
  sku: varchar('sku', { length: 255 }).unique(),
  stock: integer('stock').default(0).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0').notNull(),
  reviewCount: integer('reviewCount').default(0).notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  categoryIdFk: foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categories.id],
    name: 'products_categoryId_fk',
  }).onDelete('cascade'),
}));

// Product images table
export const productImages = pgTable('productImages', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('productId').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt: varchar('alt', { length: 255 }),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (table) => ({
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'productImages_productId_fk',
  }).onDelete('cascade'),
}));

// Inventory table
export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('productId').notNull().unique(),
  quantity: integer('quantity').default(0).notNull(),
  lowStockThreshold: integer('lowStockThreshold').default(10).notNull(),
  lastUpdated: timestamp('lastUpdated').defaultNow().notNull(),
}, (table) => ({
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'inventory_productId_fk',
  }).onDelete('cascade'),
}));

// Carts table
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId'),
  sessionId: varchar('sessionId', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'carts_userId_fk',
  }).onDelete('cascade'),
}));

// Cart items table
export const cartItems = pgTable('cartItems', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cartId').notNull(),
  productId: uuid('productId').notNull(),
  quantity: integer('quantity').notNull(),
  priceAtAdd: decimal('priceAtAdd', { precision: 12, scale: 2 }).notNull(),
  addedAt: timestamp('addedAt').defaultNow().notNull(),
}, (table) => ({
  cartIdFk: foreignKey({
    columns: [table.cartId],
    foreignColumns: [carts.id],
    name: 'cartItems_cartId_fk',
  }).onDelete('cascade'),
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'cartItems_productId_fk',
  }).onDelete('cascade'),
  cartProductUnique: unique('cartItems_cartId_productId_unique').on(table.cartId, table.productId),
}));

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  totalAmount: decimal('totalAmount', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar('paymentStatus', { length: 20 }).default('pending').notNull(),
  paymentMethod: varchar('paymentMethod', { length: 50 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  completedAt: timestamp('completedAt'),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'orders_userId_fk',
  }).onDelete('cascade'),
}));

// Order items table
export const orderItems = pgTable('orderItems', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('orderId').notNull(),
  productId: uuid('productId').notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: decimal('priceAtPurchase', { precision: 12, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
}, (table) => ({
  orderIdFk: foreignKey({
    columns: [table.orderId],
    foreignColumns: [orders.id],
    name: 'orderItems_orderId_fk',
  }).onDelete('cascade'),
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'orderItems_productId_fk',
  }),
}));

// Addresses table
export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  street: varchar('street', { length: 500 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }),
  postalCode: varchar('postalCode', { length: 20 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  isDefault: boolean('isDefault').default(false).notNull(),
  type: varchar('type', { length: 20 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'addresses_userId_fk',
  }).onDelete('cascade'),
}));

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('productId').notNull(),
  userId: uuid('userId'),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  helpfulCount: integer('helpfulCount').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'reviews_productId_fk',
  }).onDelete('cascade'),
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'reviews_userId_fk',
  }).onDelete('cascade'),
}));

// Enquiries table
export const enquiries = pgTable('enquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('productId').notNull(),
  categoryId: uuid('categoryId').notNull(),
  userId: uuid('userId'),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('new').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  respondedAt: timestamp('respondedAt'),
}, (table) => ({
  productIdFk: foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: 'enquiries_productId_fk',
  }).onDelete('cascade'),
  categoryIdFk: foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categories.id],
    name: 'enquiries_categoryId_fk',
  }).onDelete('cascade'),
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'enquiries_userId_fk',
  }).onDelete('cascade'),
}));

// Category assignments table — maps a category to the staff member(s) responsible for it.
// Used to route product enquiries to the right person.
export const categoryAssignments = pgTable('categoryAssignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('categoryId').notNull(),
  staffUserId: uuid('staffUserId').notNull(),
  isPrimary: boolean('isPrimary').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (table) => ({
  categoryIdFk: foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categories.id],
    name: 'categoryAssignments_categoryId_fk',
  }).onDelete('cascade'),
  staffUserIdFk: foreignKey({
    columns: [table.staffUserId],
    foreignColumns: [users.id],
    name: 'categoryAssignments_staffUserId_fk',
  }).onDelete('cascade'),
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  relatedEntityId: varchar('relatedEntityId', { length: 255 }),
  relatedEntityType: varchar('relatedEntityType', { length: 50 }),
  isRead: boolean('isRead').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'notifications_userId_fk',
  }).onDelete('cascade'),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  carts: many(carts),
  notifications: many(notifications),
  enquiries: many(enquiries),
  categoryAssignments: many(categoryAssignments),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  enquiries: many(enquiries),
  staffAssignments: many(categoryAssignments),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categoryParent',
  }),
  children: many(categories, { relationName: 'categoryParent' }),
}));

export const categoryAssignmentsRelations = relations(categoryAssignments, ({ one }) => ({
  category: one(categories, {
    fields: [categoryAssignments.categoryId],
    references: [categories.id],
  }),
  staff: one(users, {
    fields: [categoryAssignments.staffUserId],
    references: [users.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  inventory: one(inventory),
  reviews: many(reviews),
  enquiries: many(enquiries),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
  product: one(products, {
    fields: [enquiries.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [enquiries.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [enquiries.userId],
    references: [users.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
// ---------------------------------------------------------------------------
// Marketing content — managed entirely from the (unlinked) admin area, read
// by the public site. None of this touches the commerce tables above.
// ---------------------------------------------------------------------------

// Partners table — e.g. "Authorized systems integrator of Schneider Electric"
export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 500 }).notNull(), // e.g. "Authorized distributor"
  description: text('description'),
  logoUrl: varchar('logoUrl', { length: 500 }),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// Served/client logos — "Our Clients" strip
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: varchar('logoUrl', { length: 500 }),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// Projects / case studies
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  clientName: varchar('clientName', { length: 255 }),
  summary: varchar('summary', { length: 500 }),
  description: text('description'),
  isPublished: boolean('isPublished').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Images and short video clips attached to a project
export const projectMedia = pgTable('projectMedia', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('projectId').notNull(),
  type: varchar('type', { length: 10 }).notNull(), // 'image' | 'video'
  url: varchar('url', { length: 500 }).notNull(),
  caption: varchar('caption', { length: 255 }),
  order: integer('order').default(0).notNull(),
}, (table) => ({
  projectIdFk: foreignKey({
    columns: [table.projectId],
    foreignColumns: [projects.id],
    name: 'projectMedia_projectId_fk',
  }).onDelete('cascade'),
}));

// Careers / job postings
export const jobPostings = pgTable('jobPostings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }),
  location: varchar('location', { length: 255 }),
  employmentType: varchar('employmentType', { length: 50 }).default('full_time').notNull(), // full_time | part_time | contract | internship
  description: text('description').notNull(),
  isOpen: boolean('isOpen').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  media: many(projectMedia),
}));

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(projects, {
    fields: [projectMedia.projectId],
    references: [projects.id],
  }),
}));
