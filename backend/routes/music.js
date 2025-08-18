import { Router } from 'express';
import { getPlaylistsByMood } from '../controllers/musicController.js';

const router = Router();

router.get('/:mood', getPlaylistsByMood);

export default router;

