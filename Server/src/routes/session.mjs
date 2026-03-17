import Router from "@koa/router";
import { createSession } from "../controllers/session.mjs";

const router = new Router();

router.post("/sessions", createSession);

export default router;
