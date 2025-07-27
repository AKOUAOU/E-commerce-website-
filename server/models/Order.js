const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption helpers
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key';

const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
  if (!text) return text;
  const [ivHex, encryptedHex] = text.split(':');
  if (!ivHex || !encryptedHex) return text;
  
  try {
    const decipher = crypto.createDecipher(algorithm, secretKey);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    return text; // Return original if decryption fails
  }
};

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      set: encrypt,
      get: decrypt
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      set: encrypt,
      get: decrypt
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      set: encrypt,
      get: decrypt
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        set: encrypt,
        get: decrypt
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        set: encrypt,
        get: decrypt
      },
      state: {
        type: String,
        set: encrypt,
        get: decrypt
      },
      postalCode: {
        type: String,
        set: encrypt,
        get: decrypt
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'Morocco'
      }
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productSnapshot: {
      name: {
        en: String,
        fr: String,
        ar: String
      },
      sku: String,
      image: String,
      category: String
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    },
    currency: {
      type: String,
      default: 'MAD'
    }
  }],
  totals: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    currency: {
      type: String,
      default: 'MAD'
    }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'credit_card', 'paypal'],
    default: 'cash_on_delivery'
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    default: 'standard'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    customer: String,
    admin: String
  },
  language: {
    type: String,
    enum: ['en', 'fr', 'ar'],
    default: 'en'
  },
  consentGiven: {
    type: Boolean,
    required: [true, 'Customer consent is required'],
    default: false
  },
  consentDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  estimatedDelivery: Date,
  actualDelivery: Date
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    getters: true
  },
  toObject: { 
    virtuals: true,
    getters: true
  }
});

// Virtuals
orderSchema.virtual('customer.fullName').get(function() {
  return `${this.customer.firstName} ${this.customer.lastName}`;
});

orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

orderSchema.virtual('isPaid').get(function() {
  return this.paymentStatus === 'paid';
});

orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp.slice(-8)}-${random}`;
  }

  // Calculate totals
  if (this.items && this.items.length > 0) {
    this.totals.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totals.total = this.totals.subtotal + this.totals.tax + this.totals.shipping - this.totals.discount;
  }

  next();
});

// Pre-save middleware to add status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status changed to ${newStatus}`,
    updatedBy
  });
  
  // Auto-update payment status for certain order statuses
  if (newStatus === 'delivered' && this.paymentMethod === 'cash_on_delivery') {
    this.paymentStatus = 'paid';
  }
  
  return this.save();
};

// Method to add tracking number
orderSchema.methods.addTracking = function(trackingNumber, estimatedDelivery) {
  this.trackingNumber = trackingNumber;
  this.status = 'shipped';
  if (estimatedDelivery) {
    this.estimatedDelivery = estimatedDelivery;
  }
  
  this.statusHistory.push({
    status: 'shipped',
    timestamp: new Date(),
    note: `Order shipped with tracking number: ${trackingNumber}`
  });
  
  return this.save();
};

// Static method to get order analytics
orderSchema.statics.getAnalytics = function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
      $lte: endDate || new Date()
    }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totals.total' },
        averageOrderValue: { $avg: '$totals.total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Static method to get top products
orderSchema.statics.getTopProducts = function(limit = 10, startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      $lte: endDate || new Date()
    },
    status: { $nin: ['cancelled'] }
  };

  return this.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.totalPrice' },
        orderCount: { $sum: 1 },
        productName: { $first: '$items.productSnapshot.name' },
        sku: { $first: '$items.productSnapshot.sku' }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);