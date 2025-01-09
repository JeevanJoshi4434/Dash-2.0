import { Request, Response, NextFunction, Locals } from "express";
import { IUser, Location } from "../types/user";
const { validationResult } = require('express-validator'); // For request validation
import User from "../models/user";
import { globalErrorHandler } from "../utils/errorHandler";

class UserController extends User {

    constructor() {
        super();
    }

    // Create a new user
    async create(req: Request, res: Response): Promise<Response | void> {  // Notice the 'void' in the return type
        try {
        // Validate incoming data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
            const { name, email, password, type, location }: IUser = req.body;
    
            // Creating user through service layer
            const user = await this.createUser(name, email, password, type, location);
    
            return res.status(201).json(user); // Ensure returning a response
        } catch (error: any) {
          globalErrorHandler(error, res);
        }
    }
    

    // Other controller methods...
}

export default UserController;
