const User = require('../models/User');
const logger = require('./logger');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@example.com' 
    });

    if (existingAdmin) {
      logger.info('Default admin user already exists');
      return existingAdmin;
    }

    // Create default admin user
    const adminData = {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
      isActive: true
    };

    const admin = new User(adminData);
    await admin.save();

    logger.info(`Default admin user created: ${admin.email}`);
    return admin;

  } catch (error) {
    logger.error('Error creating default admin user:', error.message);
    throw error;
  }
};

const seedCategories = async () => {
  try {
    const Category = require('../models/Category');
    
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      logger.info('Categories already exist');
      return;
    }

    // Create sample categories
    const categories = [
      {
        name: {
          en: 'Electronics',
          fr: 'Électronique',
          ar: 'الإلكترونيات'
        },
        description: {
          en: 'Electronic devices and accessories',
          fr: 'Appareils électroniques et accessoires',
          ar: 'الأجهزة الإلكترونية والإكسسوارات'
        },
        icon: '📱',
        order: 1,
        createdBy: null // Will be set after admin creation
      },
      {
        name: {
          en: 'Fashion',
          fr: 'Mode',
          ar: 'الأزياء'
        },
        description: {
          en: 'Clothing and fashion accessories',
          fr: 'Vêtements et accessoires de mode',
          ar: 'الملابس وإكسسوارات الأزياء'
        },
        icon: '👕',
        order: 2,
        createdBy: null
      },
      {
        name: {
          en: 'Home & Garden',
          fr: 'Maison et Jardin',
          ar: 'المنزل والحديقة'
        },
        description: {
          en: 'Home improvement and garden supplies',
          fr: 'Amélioration de la maison et fournitures de jardin',
          ar: 'تحسين المنزل ومستلزمات الحديقة'
        },
        icon: '🏠',
        order: 3,
        createdBy: null
      }
    ];

    // Get admin user for createdBy field
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      categories.forEach(cat => cat.createdBy = admin._id);
    }

    await Category.insertMany(categories);
    logger.info(`${categories.length} categories created`);

  } catch (error) {
    logger.error('Error seeding categories:', error.message);
    throw error;
  }
};

const seedProducts = async () => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      logger.info('Products already exist');
      return;
    }

    // Get categories
    const electronicsCategory = await Category.findOne({ 'name.en': 'Electronics' });
    const fashionCategory = await Category.findOne({ 'name.en': 'Fashion' });
    
    if (!electronicsCategory || !fashionCategory) {
      throw new Error('Categories not found. Please seed categories first.');
    }

    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin user not found');
    }

    // Create sample products
    const products = [
      {
        name: {
          en: 'Wireless Bluetooth Headphones',
          fr: 'Casque Bluetooth Sans Fil',
          ar: 'سماعات بلوتوث لاسلكية'
        },
        description: {
          en: 'High-quality wireless headphones with noise cancellation and long battery life.',
          fr: 'Casque sans fil de haute qualité avec annulation de bruit et longue durée de vie de la batterie.',
          ar: 'سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء وعمر بطارية طويل.'
        },
        shortDescription: {
          en: 'Premium wireless headphones with noise cancellation',
          fr: 'Casque sans fil premium avec annulation de bruit',
          ar: 'سماعات لاسلكية متميزة مع إلغاء الضوضاء'
        },
        category: electronicsCategory._id,
        price: {
          original: 299.99,
          discounted: 249.99,
          currency: 'MAD'
        },
        stock: {
          quantity: 50,
          lowStockThreshold: 10
        },
        images: [{
          url: '/images/headphones-1.jpg',
          alt: {
            en: 'Wireless Bluetooth Headphones',
            fr: 'Casque Bluetooth Sans Fil',
            ar: 'سماعات بلوتوث لاسلكية'
          },
          isPrimary: true,
          order: 0
        }],
        status: 'active',
        featured: true,
        createdBy: admin._id
      },
      {
        name: {
          en: 'Cotton T-Shirt',
          fr: 'T-shirt en Coton',
          ar: 'تي شيرت قطني'
        },
        description: {
          en: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
          fr: 'T-shirt confortable 100% coton disponible en plusieurs couleurs et tailles.',
          ar: 'تي شيرت مريح من القطن 100% متوفر بألوان ومقاسات متعددة.'
        },
        shortDescription: {
          en: 'Comfortable 100% cotton t-shirt',
          fr: 'T-shirt confortable 100% coton',
          ar: 'تي شيرت مريح من القطن 100%'
        },
        category: fashionCategory._id,
        price: {
          original: 89.99,
          currency: 'MAD'
        },
        stock: {
          quantity: 100,
          lowStockThreshold: 20
        },
        images: [{
          url: '/images/tshirt-1.jpg',
          alt: {
            en: 'Cotton T-Shirt',
            fr: 'T-shirt en Coton',
            ar: 'تي شيرت قطني'
          },
          isPrimary: true,
          order: 0
        }],
        status: 'active',
        featured: false,
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    logger.info(`${products.length} products created`);

  } catch (error) {
    logger.error('Error seeding products:', error.message);
    throw error;
  }
};

const seedAll = async () => {
  try {
    logger.info('Starting data seeding...');
    
    await createDefaultAdmin();
    await seedCategories();
    await seedProducts();
    
    logger.info('Data seeding completed successfully');
  } catch (error) {
    logger.error('Error during data seeding:', error.message);
    throw error;
  }
};

module.exports = {
  createDefaultAdmin,
  seedCategories,
  seedProducts,
  seedAll
};