const { Service, SubService } = require('./models');

async function checkDb() {
    try {
        const services = await Service.findAll({
            include: [{ model: SubService }]
        });
        console.log("--- DATABASE CHECK ---");
        console.log(`Found ${services.length} services.`);
        services.forEach(s => {
            console.log(`Service: ${s.title} (ID: ${s.id})`);
            console.log(` - SubServices: ${s.SubServices ? s.SubServices.length : 0}`);
        });
        console.log("----------------------");
    } catch (error) {
        console.error("DB Check Failed:", error);
    }
}

checkDb();
