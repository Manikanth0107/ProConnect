import multer from "multer";

import { storage } from "../cloudConfig.js";

export const upload = multer({ storage });
