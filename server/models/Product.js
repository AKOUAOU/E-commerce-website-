const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    fr: {
      type: String,
      required: [true, 'French product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    }
  },
  description: {
    en: {
      type: String,
      required: [true, 'English description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    fr: {
      type: String,
      required: [true, 'French description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    }
  },
  shortDescription: {
    en: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    fr: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    ar: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    }
  },
  specifications: {
    en: [{
      name: String,
      value: String
    }],
    fr: [{
      name: String,
      value: String
    }],
    ar: [{
      name: String,
      value: String
    }]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      en: String,
      fr: String,
      ar: String
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  price: {
    original: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Price cannot be negative']
    },
    discounted: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
      validate: {
        validator: function(value) {
          return !value || value < this.price.original;
        },
        message: 'Discounted price must be less than original price'
      }
    },
    currency: {
      type: String,
      default: 'MAD',
      enum: ['MAD', 'EUR', 'USD']
    }
  },
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'kg', 'lb'],
      default: 'cm'
    }
  },
  tags: {
    en: [String],
    fr: [String],
    ar: [String]
  },
  seo: {
    metaTitle: {
      en: String,
      fr: String,
      ar: String
    },
    metaDescription: {
      en: String,
      fr: String,
      ar: String
    },
    keywords: {
      en: [String],
      fr: [String],
      ar: [String]
    },
    slug: {
      en: {
        type: String,
        unique: true,
        lowercase: true
      },
      fr: {
        type: String,
        unique: true,
        lowercase: true
      },
      ar: {
        type: String,
        unique: true,
        lowercase: true
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  newProduct: {
    type: Boolean,
    default: true
  },
  onSale: {
    type: Boolean,
    default: false
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    cartAdds: {
      type: Number,
      default: 0
    },
    wishlistAdds: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  vendor: {
    name: String,
    contact: String,
    website: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
productSchema.virtual('isInStock').get(function() {
  return this.stock.quantity > 0;
});

productSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.lowStockThreshold;
});

productSchema.virtual('hasDiscount').get(function() {
  return this.price.discounted && this.price.discounted < this.price.original;
});

productSchema.virtual('discountPercentage').get(function() {
  if (!this.hasDiscount) return 0;
  return Math.round(((this.price.original - this.price.discounted) / this.price.original) * 100);
});

productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

// Indexes for performance
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'name.en': 'text', 'name.fr': 'text', 'name.ar': 'text' });
productSchema.index({ 'tags.en': 1, 'tags.fr': 1, 'tags.ar': 1 });
productSchema.index({ 'seo.slug.en': 1, 'seo.slug.fr': 1, 'seo.slug.ar': 1 });
productSchema.index({ 'price.original': 1, 'price.discounted': 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ newProduct: 1, status: 1 });
productSchema.index({ onSale: 1, status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ updatedAt: -1 });

// Pre-save middleware to generate SKU and slugs
productSchema.pre('save', function(next) {
  // Generate SKU if not provided
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const categoryPrefix = this.category ? this.category.toString().slice(-3).toUpperCase() : 'PRD';
    this.sku = `${categoryPrefix}${timestamp}`;
  }

  // Generate slugs from names
  if (!this.seo.slug.en && this.name.en) {
    this.seo.slug.en = this.name.en.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.seo.slug.fr && this.name.fr) {
    this.seo.slug.fr = this.name.fr.toLowerCase()
      .replace(/[^a-z0-9àâäéèêëïîôùûüÿ]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.seo.slug.ar && this.name.ar) {
    this.seo.slug.ar = this.name.ar.toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Set sale status based on discount
  this.onSale = this.hasDiscount;

  next();
});

// Method to increment view count
productSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

// Method to increment cart adds
productSchema.methods.incrementCartAdds = function() {
  this.analytics.cartAdds += 1;
  return this.save();
};

// Method to increment purchases
productSchema.methods.incrementPurchases = function(quantity = 1) {
  this.analytics.purchases += quantity;
  if (this.stock.trackInventory) {
    this.stock.quantity = Math.max(0, this.stock.quantity - quantity);
  }
  return this.save();
};

// Static method to find by slug
productSchema.statics.findBySlug = function(slug, language = 'en') {
  const slugField = `seo.slug.${language}`;
  return this.findOne({ [slugField]: slug, status: 'active' }).populate('category');
};

// Static method to search products
productSchema.statics.searchProducts = function(query, language = 'en', options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock = true,
    featured,
    onSale,
    page = 1,
    limit = 20,
    sort = 'createdAt'
  } = options;

  const filter = { status: 'active' };

  if (query) {
    filter.$text = { $search: query };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter['price.original'] = {};
    if (minPrice !== undefined) filter['price.original'].$gte = minPrice;
    if (maxPrice !== undefined) filter['price.original'].$lte = maxPrice;
  }

  if (inStock) {
    filter['stock.quantity'] = { $gt: 0 };
  }

  if (featured !== undefined) {
    filter.featured = featured;
  }

  if (onSale !== undefined) {
    filter.onSale = onSale;
  }

  const sortOptions = {};
  switch (sort) {
    case 'price-asc':
      sortOptions['price.original'] = 1;
      break;
    case 'price-desc':
      sortOptions['price.original'] = -1;
      break;
    case 'name':
      sortOptions[`name.${language}`] = 1;
      break;
    case 'popular':
      sortOptions['analytics.purchases'] = -1;
      break;
    default:
      sortOptions.createdAt = -1;
  }

  return this.find(filter)
    .populate('category')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

module.exports = mongoose.model('Product', productSchema);