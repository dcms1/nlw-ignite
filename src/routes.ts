import { Router } from "express";
import { AutenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticate";

const router = Router();

router.post("/authenticate",new AutenticateUserController().handle)
router.post("/messages",ensureAuthenticated,new CreateMessageController().handle)

router.get("/messages/last3",new GetLast3MessagesController().handle)

export{router}