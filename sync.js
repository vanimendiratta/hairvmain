const { sequelize, Service, SubService, User } = require('./models');
const bcrypt = require('bcryptjs');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        // Sync models (force: true will drop tables if they exist)
        await sequelize.sync({ force: true });
        console.log('Database synced!');

        // Seed Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created');

        // Seed Services
        // 1. Hair Services
        const hairService = await Service.create({
            title: 'Hair Services',
            description: 'Professional hair cutting, styling, and treatments.',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1000'
        });

        await SubService.create({ title: 'Haircut', description: 'Standard haircut includes wash and blow-dry.', price: 50.00, duration: 60, serviceId: hairService.id });
        await SubService.create({ title: 'Hair Coloring', description: 'Full head coloring with premium dye.', price: 120.00, duration: 120, serviceId: hairService.id });
        await SubService.create({ title: 'Keratin Treatment', description: 'Smoothing treatment for frizzy hair.', price: 200.00, duration: 180, serviceId: hairService.id });

        // 2. Nail Services
        const nailService = await Service.create({
            title: 'Nail Services',
            description: 'Manicures, pedicures, and nail art.',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1000'
        });

        await SubService.create({ title: 'Classic Manicure', description: 'Nail shaping, cuticle care, and polish.', price: 30.00, duration: 45, serviceId: nailService.id });
        await SubService.create({ title: 'Spa Pedicure', description: 'Relaxing foot bath, scrub, and massage.', price: 45.00, duration: 60, serviceId: nailService.id });
        await SubService.create({ title: 'Gel Polish Application', description: 'Long-lasting gel polish.', price: 40.00, duration: 50, serviceId: nailService.id });

        // 3. Facial Services
        const facialService = await Service.create({
            title: 'Facial Services',
            description: 'Rejuvenating skin treatments.',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000'
        });

        await SubService.create({ title: 'Deep Cleansing Facial', description: 'Deep pore cleaning and exfoliation.', price: 80.00, duration: 60, serviceId: facialService.id });
        await SubService.create({ title: 'Anti-Aging Facial', description: 'Collagen boosting treatment.', price: 110.00, duration: 75, serviceId: facialService.id });

        // 4. Massage Services
        const massageService = await Service.create({
            title: 'Massage Therapy',
            description: 'Relaxing and therapeutic massages.',
            image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1000'
        });

        await SubService.create({ title: 'Swedish Massage', description: 'Gentle full body massage.', price: 90.00, duration: 60, serviceId: massageService.id });
        await SubService.create({ title: 'Deep Tissue Massage', description: 'Intense massage for muscle tension.', price: 100.00, duration: 60, serviceId: massageService.id });

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

syncDatabase();
