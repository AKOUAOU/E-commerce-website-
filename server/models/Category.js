const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    fr: {
      type: String,
      required: [true, 'French category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    }
  },
  description: {
    en: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    fr: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    ar: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
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
  },
  icon: {
    type: String,
    trim: true
  },
  image: {
    url: String,
    alt: {
      en: String,
      fr: String,
      ar: String
    }
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
    }
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

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Indexes
categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ 'name.en': 1, 'name.fr': 1, 'name.ar': 1 });
categorySchema.index({ 'slug.en': 1, 'slug.fr': 1, 'slug.ar': 1 });
categorySchema.index({ isActive: 1 });

// Pre-save middleware to generate slugs
categorySchema.pre('save', function(next) {
  if (!this.slug.en && this.name.en) {
    this.slug.en = this.name.en.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.slug.fr && this.name.fr) {
    this.slug.fr = this.name.fr.toLowerCase()
      .replace(/[^a-z0-9àâäéèêëïîôùûüÿ]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.slug.ar && this.name.ar) {
    this.slug.ar = this.name.ar.toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = function(language = 'en') {
  return this.aggregate([
    { $match: { isActive: true, parent: null } },
    { $sort: { order: 1 } },
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parent',
        as: 'descendants',
        maxDepth: 3
      }
    }
  ]);
};

// Static method to find by slug
categorySchema.statics.findBySlug = function(slug, language = 'en') {
  const slugField = `slug.${language}`;
  return this.findOne({ [slugField]: slug, isActive: true });
};

module.exports = mongoose.model('Category', categorySchema);