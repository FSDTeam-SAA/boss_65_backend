import express from 'express';
import {
    createReferralAndLoyaltyProgram,
    getAllReferralAndLoyaltyPrograms,
    getReferralAndLoyaltyProgramById,
    updateReferralAndLoyaltyProgram,
    deleteReferralAndLoyaltyProgram
} from './referralAndLoyaltyPrograms.controller.js';

const router = express.Router();

router.post('/', createReferralAndLoyaltyProgram);
router.get('/', getAllReferralAndLoyaltyPrograms);
router.get('/:id', getReferralAndLoyaltyProgramById);
router.put('/:id', updateReferralAndLoyaltyProgram);
router.delete('/:id', deleteReferralAndLoyaltyProgram);

export default router;
