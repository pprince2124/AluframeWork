import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
       credentials: true
    })
)
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

//routes import
import healthCheckRoutes from './routes/healthcheck.routes.js';
app.use('/api/v1/healthCheck', healthCheckRoutes);
export default app;

//import user routes
import userRoutes from './routes/user.routes.js';
app.use('/api/v1/users', userRoutes);

//import booking routes
import bookingRoutes from './routes/booking.routes.js';
app.use('/api/v1/bookings', bookingRoutes);

//import service routes
import serviceRoutes from './routes/service.routes.js';
app.use('/api/v1/services', serviceRoutes);

//import vendor routes
import vendorRoutes from './routes/vendor.routes.js';
app.use('/api/v1/vendors', vendorRoutes);

//import quote routes
import quoteRoutes from './routes/quote.routes.js';
app.use('/api/quote', quoteRoutes);

// src/app.js or src/index.js (where routes are mounted)

import authRoutes from './routes/auth.routes.js';

app.use('/api/v1/auth', authRoutes);

//import shipMaterial routes
import shipMaterialRoutes from './routes/shipMaterial.routes.js';       
app.use('/api/v1/shipments', shipMaterialRoutes);

//import review routes
import reviewRoutes from './routes/review.routes.js';
app.use('/api/v1/reviews', reviewRoutes);

//import cart routes
import cartRoutes from './routes/cart.routes.js';
app.use('/api/v1/cart', cartRoutes);

//import service category routes
import serviceCategoryRoutes from './routes/serviceCategory.routes.js'; 
app.use('/api/v1/serviceCategories', serviceCategoryRoutes);

//import subcategory routes
import subCategoryRoutes from './routes/subCategory.routes.js'; 
app.use('/api/v1/subCategories', subCategoryRoutes);

//import payment routes
import paymentRoutes from './routes/payment.routes.js';
app.use('/api/payments', paymentRoutes);

//import support routes
import supportRoutes from './routes/support.routes.js';
app.use('/api/support', supportRoutes);

//import consultation routes
import consultationRoutes from './routes/consultation.routes.js';   
app.use('/api/v1/consultations', consultationRoutes);

//import dashboard routes
import dashboardRoutes from './routes/dashboard.routes.js';
app.use('/api/v1/dashboard', dashboardRoutes);









import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;
