//File: controller.mjs for side scrolling database microservice REST API
//Programmers: Kelsey Shanks, Wolfie Essink

import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import { 
    connectToDatabases, 
    create_side_scroller_data, 
    getSideScrollerData, 
    getSideScrollerDataByLevelId, 
    updateSideScrollerData, 
    deleteSideScrollerDataById 
} from './model.mjs';

const ERROR_NOT_FOUND = {Error: "Not found"};
const ERROR_INVALID_REQ = {Error: "Invalid request"};
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//connect to databases on server start
app.listen(PORT, async () => {
    try {
        await connectToDatabases();
        console.log(`Server listening on port ${PORT}...`);
        
        //initialize levels if they don't exist
        const existingLevels = await getSideScrollerData();
        if (existingLevels.length === 0) {
            //level 1 should be unlocked by default
            await create_side_scroller_data(1, true);
            await create_side_scroller_data(2, false);
            await create_side_scroller_data(3, false);
            console.log("Initialized default level data");
        }
    } catch (error) {
        console.error("Failed to start server:", error);
    }
});

//GET all levels
app.get('/api/levels', asyncHandler(async (req, res) => {
    const levels = await getSideScrollerData();
    res.status(200).json(levels);
}));

//GET specific level by levelId
app.get('/api/levels/:levelId', asyncHandler(async (req, res) => {
    const level = await getSideScrollerDataByLevelId(parseInt(req.params.levelId));
    if (level === null) {
        res.status(404).json(ERROR_NOT_FOUND);
    } else {
        res.status(200).json(level);
    }
}));

//CREATE new level (POST)
app.post('/api/levels', asyncHandler(async (req, res) => {
    const { levelId, unlocked } = req.body;
    if (typeof levelId !== 'number' || typeof unlocked !== 'boolean') {
        res.status(400).json(ERROR_INVALID_REQ);
        return;
    }
    const result = await create_side_scroller_data(levelId, unlocked);
    res.status(201).json(result);
}));

//UPDATE level (PUT by levelId)
app.put('/api/levels/:levelId', asyncHandler(async (req, res) => {
    const levelId = parseInt(req.params.levelId);
    const level = await getSideScrollerDataByLevelId(levelId);
    
    if (level === null) {
        res.status(404).json(ERROR_NOT_FOUND);
        return;
    }
    
    const { unlocked } = req.body;
    if (typeof unlocked !== 'boolean') {
        res.status(400).json(ERROR_INVALID_REQ);
        return;
    }
    
    const updatedLevel = await updateSideScrollerData(level._id, { unlocked });
    res.status(200).json(updatedLevel);
}));

//DELETE level by levelId
app.delete('/api/levels/:levelId', asyncHandler(async (req, res) => {
    const levelId = parseInt(req.params.levelId);
    const level = await getSideScrollerDataByLevelId(levelId);
    if (level === null) {
        res.status(404).json(ERROR_NOT_FOUND);
    } else {
        await deleteSideScrollerDataById(level._id);
        res.status(204).end();
    }
}));