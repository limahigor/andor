import { Router } from "express";
import {
  getChannels,
  createChannel,
  getChannelWithMedia,
} from "../controllers/Controller.js";

const router = Router();

router.get("/list", getChannels);
router.post("/create", createChannel);
router.get("/:channelId/media/:mediaId", getChannelWithMedia);

export default router;
