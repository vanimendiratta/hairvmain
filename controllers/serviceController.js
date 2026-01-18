const { Service, SubService } = require('../models');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [{ model: SubService }]
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id, {
            include: [{ model: SubService }]
        });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const service = await Service.create({ title, description, image });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SubService Methods
exports.createSubService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, price, duration, availableSlots } = req.body;
        const subService = await SubService.create({
            title, description, price, duration, serviceId, availableSlots
        });
        res.status(201).json(subService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        const service = await Service.findByPk(id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        service.title = title;
        service.description = description;
        service.image = image;
        await service.save();

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, duration, availableSlots } = req.body;
        const subService = await SubService.findByPk(id);
        if (!subService) return res.status(404).json({ message: "SubService not found" });

        subService.title = title;
        subService.description = description;
        subService.price = price;
        subService.duration = duration;
        if (availableSlots) subService.availableSlots = availableSlots;

        await subService.save();

        res.json(subService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await Service.destroy({ where: { id } });
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSubService = async (req, res) => {
    try {
        const { id } = req.params;
        await SubService.destroy({ where: { id } });
        res.json({ message: 'Sub-service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
