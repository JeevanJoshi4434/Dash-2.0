import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import { UserRequest } from "../types/express";
import Stock, { StockModel } from "../models/stock";
import User from "../models/user";
import { Location } from "../types/user";
import { ReturnStocks, SplitterStocks } from "../types/types";
const { validationResult } = require('express-validator');


class StockController extends Stock {
    private userService: User;
    constructor() {
        super();
        this.userService = new User();
    }

    async create(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            // Validate incoming data
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, quantity, price, description, category, location } = req.body;

            // Creating user through service layer
            const stock = await this.createStock(name, price, quantity, req.user.id, category, description, location);
            return res.status(201).json({ stock });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getUserStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { id } = req.user;
            const stocks = await StockModel.find({ userId: id }).exec();
            console.log(id, stocks);
            return res.status(200).json(stocks);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async get(req: UserRequest): Promise<ReturnStocks> {
        try {
            const { id } = req.user;
            const stock = await this.getStock(id as string);
            return { success: true, stocks: stock };
        } catch (error) {
            throw error;
        }
    }

    private async filterStocks(req: UserRequest): Promise<SplitterStocks> {
        try {
            const result = await this.get(req);
            const availableStocks = result.stocks?.filter(stock => stock.quantity > 0);
            return {
                success: true,
                stocks: [],
                available: availableStocks || [],
                unavailable: result.stocks?.filter(stock => stock.quantity === 0) || []
            }
        } catch (error) {
            throw error;
        }
    }

    async getAvailableStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const result = await this.filterStocks(req);
            return res.status(200).json(result.available);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getUnavailableStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const result = await this.filterStocks(req);
            return res.status(200).json(result.unavailable);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getNearStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { long, lat } = req.query;
            let { limit, page } = req.query;

            // Convert limit and page to numbers after ensuring they are strings 
            const limitNumber = limit ? parseInt(limit as string, 10) : 10; // Default limit to 10 if not provided
            const pageNumber = page ? parseInt(page as string, 10) : 1;    // Default page to 1 if not provided

            // Get the user's location
            const findUserLocation = async () => {
                if (!long || !lat) {
                    return await this.userService.findUserById(req.user.id);
                } else {
                    return {
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(long as string), parseFloat(lat as string)]
                        }
                    };
                }
            };

            const user = await findUserLocation();
            if (!user) return res.status(400).json({ error: 'User not found' });
            console.log(user);
            const userLocation = user?.location as Location;
            const maxDistance = 10000; // 10 kilometers

            const stocks = await StockModel.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [userLocation.coordinates[0], userLocation.coordinates[1]]
                        },
                        $maxDistance: maxDistance
                    }
                }
            })
                .limit(limitNumber)
                .skip((pageNumber - 1) * limitNumber).exec(); // Skip for pagination

            return res.status(200).json({ stocks });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


}

export default StockController;
