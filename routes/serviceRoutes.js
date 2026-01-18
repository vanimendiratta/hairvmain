const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Protected Routes
router.post('/', verifyToken, serviceController.createService);
router.post('/:serviceId/sub', verifyToken, serviceController.createSubService);
router.put('/:id', verifyToken, serviceController.updateService);
router.put('/sub/:id', verifyToken, serviceController.updateSubService);
router.delete('/:id', verifyToken, serviceController.deleteService);
router.delete('/sub/:id', verifyToken, serviceController.deleteSubService);

module.exports = router;
