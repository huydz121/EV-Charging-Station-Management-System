require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');

const User = require('./models/User');
const Station = require('./models/Station');
const PriceRate = require('./models/PriceRate');
const ChargingSession = require('./models/ChargingSession');
const Maintenance = require('./models/Maintenance');

async function seed() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Station.deleteMany({});
    await PriceRate.deleteMany({});
    await ChargingSession.deleteMany({});
    await Maintenance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin user
    const admin = await User.create({
      fullName: 'Admin EV Charge',
      email: 'admin@evcharge.vn',
      phone: '0901234567',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log('👤 Admin created: admin@evcharge.vn / admin123');

    // Create Customer user
    const customer = await User.create({
      fullName: 'Nguyễn Văn A',
      email: 'customer@evcharge.vn',
      phone: '0909876543',
      password: 'customer123',
      role: 'customer',
      balance: 500000,
      isActive: true
    });
    console.log('👤 Customer created: customer@evcharge.vn / customer123');

    // Create sample stations in Quy Nhơn
    const stations = await Station.insertMany([
      {
        name: 'Trạm sạc EV Quảng Trường Quy Nhơn',
        address: 'Quảng trường Nguyễn Tất Thành, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2215, 13.7788] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'CCS', power: 50, status: 'available' },
          { type: 'CHAdeMO', power: 50, status: 'in_use' }
        ],
        status: 'active',
        pricePerKwh: 4500,
        rating: 4.5,
        totalRatings: 128,
        description: 'Trạm sạc nhanh tại trung tâm Quảng trường Nguyễn Tất Thành, Quy Nhơn',
        amenities: ['wifi', 'café', 'wc'],
        operatingHours: { open: '06:00', close: '23:00' }
      },
      {
        name: 'Trạm sạc EV Vincom Quy Nhơn',
        address: 'Lê Duẩn, Lý Thường Kiệt, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2185, 13.7725] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'CCS', power: 100, status: 'available' },
          { type: 'Tesla', power: 120, status: 'available' }
        ],
        status: 'active',
        pricePerKwh: 5000,
        rating: 4.8,
        totalRatings: 256,
        description: 'Trạm sạc cao cấp tại TTTM Vincom Plaza Quy Nhơn',
        amenities: ['wifi', 'café', 'wc', 'parking'],
        operatingHours: { open: '00:00', close: '23:59' }
      },
      {
        name: 'Trạm sạc EV Đại học Quy Nhơn',
        address: '170 An Dương Vương, Nguyễn Văn Cừ, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2201, 13.7667] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'CCS', power: 50, status: 'maintenance' }
        ],
        status: 'active',
        pricePerKwh: 4000,
        rating: 4.2,
        totalRatings: 87,
        description: 'Trạm sạc tại khu vực Đại học Quy Nhơn, giáp biển',
        amenities: ['wc'],
        operatingHours: { open: '05:00', close: '22:00' }
      },
      {
        name: 'Trạm sạc EV Bến xe Quy Nhơn',
        address: '71 Tây Sơn, Ghềnh Ráng, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2088, 13.7705] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'CCS', power: 50, status: 'available' }
        ],
        status: 'active',
        pricePerKwh: 4800,
        rating: 4.0,
        totalRatings: 64,
        description: 'Trạm sạc thuận tiện gần Bến xe trung tâm thành phố',
        amenities: ['wifi', 'wc'],
        operatingHours: { open: '06:00', close: '22:00' }
      },
      {
        name: 'Trạm sạc EV FLC Sea Tower',
        address: 'Nguyễn Trung Tín, Nguyễn Văn Cừ, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2234, 13.7601] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' },
          { type: 'CHAdeMO', power: 50, status: 'available' },
          { type: 'CCS', power: 100, status: 'in_use' }
        ],
        status: 'active',
        pricePerKwh: 4200,
        rating: 4.3,
        totalRatings: 95,
        description: 'Trạm sạc khu tổ hợp FLC Sea Tower Quy Nhơn',
        amenities: ['wifi', 'café', 'parking'],
        operatingHours: { open: '00:00', close: '23:59' }
      },
      {
        name: 'Trạm sạc EV Eo Gió - Kỳ Co',
        address: 'Xã Nhơn Lý, TP. Quy Nhơn, Bình Định',
        location: { type: 'Point', coordinates: [109.2882, 13.8441] },
        connectors: [
          { type: 'Type2', power: 22, status: 'available' }
        ],
        status: 'maintenance',
        pricePerKwh: 3800,
        rating: 3.8,
        totalRatings: 42,
        description: 'Trạm sạc tại khu du lịch tản bộ Eo Gió đang bảo trì',
        operatingHours: { open: '07:00', close: '21:00' }
      }
    ]);
    console.log(`⚡ ${stations.length} stations created`);

    // Mock charging sessions for dashboard data
    const sessionsData = [];
    const now = new Date();
    for (let i = 0; i < 80; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 90);
      const createdAt = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      const randomStation = stations[Math.floor(Math.random() * stations.length)];
      const energyDelivered = Math.floor(Math.random() * 50) + 10; 
      const totalCost = energyDelivered * randomStation.pricePerKwh;
      
      sessionsData.push({
        user: customer._id,
        station: randomStation._id,
        connectorIndex: Math.floor(Math.random() * randomStation.connectors.length),
        status: 'completed',
        startTime: createdAt,
        endTime: new Date(createdAt.getTime() + (Math.floor(Math.random() * 60) + 30) * 60 * 1000),
        energyDelivered: energyDelivered,
        pricePerKwh: randomStation.pricePerKwh,
        totalCost: totalCost,
        paymentStatus: 'paid',
        paymentMethod: Math.random() > 0.5 ? 'wallet' : 'payos',
        createdAt: createdAt,
        updatedAt: createdAt
      });
    }

    // Add 2 active charging sessions
    sessionsData.push({
      user: customer._id,
      station: stations[0]._id,
      connectorIndex: 0,
      status: 'charging',
      startTime: new Date(),
      energyDelivered: 5,
      pricePerKwh: stations[0].pricePerKwh,
      totalCost: 5 * stations[0].pricePerKwh,
      paymentStatus: 'unpaid',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    sessionsData.push({
      user: admin._id,
      station: stations[1]._id,
      connectorIndex: 1,
      status: 'charging',
      startTime: new Date(now.getTime() - 15 * 60 * 1000),
      energyDelivered: 12,
      pricePerKwh: stations[1].pricePerKwh,
      totalCost: 12 * stations[1].pricePerKwh,
      paymentStatus: 'unpaid',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000)
    });

    await ChargingSession.insertMany(sessionsData);
    console.log(`🔌 ${sessionsData.length} charging sessions created`);

    // Mock maintenance data
    const maintenanceData = [
      {
        station: stations[0]._id,
        type: 'scheduled',
        description: 'Bảo trì định kỳ tủ sạc',
        status: 'pending',
        scheduledDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        station: stations[2]._id,
        type: 'emergency',
        description: 'Sửa lỗi kết nối màn hình hiển thị',
        status: 'in_progress',
        scheduledDate: new Date()
      },
      {
        station: stations[stations.length - 1]._id,
        type: 'inspection',
        description: 'Kiểm tra tín hiệu mạng',
        status: 'completed',
        scheduledDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        completedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    await Maintenance.insertMany(maintenanceData);
    console.log(`🛠️ ${maintenanceData.length} maintenance records created`);

    // Create price rates
    await PriceRate.insertMany([
      { name: 'Giá thường', type: 'standard', pricePerKwh: 4500, startHour: 6, endHour: 17, isActive: true },
      { name: 'Giá cao điểm', type: 'peak', pricePerKwh: 6000, startHour: 17, endHour: 22, isActive: true },
      { name: 'Giá thấp điểm', type: 'off_peak', pricePerKwh: 3000, startHour: 22, endHour: 6, isActive: true }
    ]);
    console.log('💰 Price rates created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('================================');
    console.log('Admin:    admin@evcharge.vn / admin123');
    console.log('Customer: customer@evcharge.vn / customer123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
// Tuan 3
