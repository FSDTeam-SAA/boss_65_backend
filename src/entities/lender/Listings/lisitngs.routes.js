import express from 'express'



import { deleteDress, getAllDresses, getDressById, getDressesByLender, listDress, updateDress } from './listings.controller.js'
import { adminLenderMiddleware, lenderMiddleware, verifyToken } from '../../../core/middlewares/authMiddleware.js'
const router = express.Router()
router.post('/listings',verifyToken,lenderMiddleware,listDress)
router.get('/',getAllDresses)
router.get('/:id',getDressById)
router.get('/:lenderId',getDressesByLender)
router.patch('/:id',verifyToken,adminLenderMiddleware,updateDress)
router.delete('/:id',verifyToken,adminLenderMiddleware,deleteDress)

export default router