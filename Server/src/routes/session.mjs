import Router from "@koa/router";
import {
  createSession,
  deleteSession,
  getSession,
} from "../controllers/session.mjs";

const router = new Router();

router.post("/sessions", createSession);
router.get("/sessions/current", getSession);
router.delete("/sessions/current", deleteSession);

export default router;
