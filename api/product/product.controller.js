const express = require('express');
const router = express.Router();
const productService = require('./product.service.js');
const { StyleMaster, RouteMaster, ProcessMaster, SubProcessMaster, ProductionPlans } = require('../models');



// POST: Save a new production plan
router.post('/saveproductionplan', async (req, res, next) => {
  try {
    const {
      styleId,
      styleRouteMapId,
      subProcessId,
      processId,
      line,
      shift,
      productionPlanFrom,
      productionPlanEnd,
      overallTargetQuantity,
      noOfPositions = 50,
    } = req.body;
    
    if (!styleId || !styleRouteMapId || !line || !productionPlanFrom || !productionPlanEnd || !overallTargetQuantity) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const savedPlan = await ProductionPlans.create({
      style:styleId,
      routeMap:styleRouteMapId,
      subProcessId,
      processId,
      line,
      shift,
      productionPlanFrom,
      productionPlanEnd,
      targetQty: overallTargetQuantity, // map it correctly
      noOfPositions,
    });
    

    // Respond with success
    res.json({ success: true, message: 'Production plan saved successfully', id: savedPlan.id });
  } catch (err) {
    console.error('Error saving production plan:', err); // Log detailed error
    res.status(500).json({ success: false, message: 'Failed to save production plan', error: err.message });
    next(err); // Pass the error to the global error handler
  }
});


// GET: All production plans with associated data
router.get('/getproductionplan', async (req, res, next) => {
  try {
    const productionplans = await ProductionPlans.findAll({
      include: [
        { model: Styles, as: 'style' },
        { model: RouteMaps, as: 'routeMap' },
        { model: Processes, as: 'process' },
        { model: SubProcesses, as: 'subProcess' },
        { model: Positions, as: 'positions' }
      ],
      order: [['id', 'DESC']] // Optional: sort newest first
    });

    res.json(productionplans); // Send full JSON array
  } catch (err) {
    next(err);
  }
});


// GET: All styles with associated routes
router.get('/styles', async (req, res, next) => {
  try {
    const styles = await StyleMaster.findAll({
      include: [
        {
          model: RouteMaster,
          as: 'routes',
        },
      ],
    });
    res.json(styles);
  } catch (err) {
    next(err);
  }
});

// GET: All routes for a specific style, with processes
router.get('/routes/:styleId', async (req, res, next) => {
  try {
    const routes = await RouteMaster.findAll({
      where: { StyleID: req.params.styleId },
      include: [
        {
          model: ProcessMaster,
          as: 'processes',
        },
      ],
    });
    res.json(routes);
  } catch (err) {
    next(err);
  }
});

// GET: All processes and sub-processes for a specific route
router.get('/processes/:routeMapId', async (req, res, next) => {
  try {
    const processes = await ProcessMaster.findAll({
      where: { StyleRouteMapID: req.params.routeMapId },
      include: [
        {
          model: SubProcessMaster,
          as: 'subProcesses', // Ensure this alias matches your association name
        },
      ],
    });
   
    res.json(processes);
  } catch (err) {
    next(err);
  }
});

// GET: Summary list for LBR
router.get('/summary', listSummary);

// GET: List of stations for a specific line
router.get('/lines/:lineId/stations', listLines);

// Handler functions
function listSummary(req, res, next) {
  productService
    .listSummary(req)
    .then((data) => res.json(data))
    .catch(next);
}

function listLines(req, res, next) {
  productService
    .listLines(req)
    .then((params) => res.json(params))
    .catch(next);
}

module.exports = router;
