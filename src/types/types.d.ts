import { Schema } from "mongoose";
import { Location } from "./user";

export type mongooseId = Schema.Types.ObjectId;

export interface Stock {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    userId: mongooseId;
    category: string;
    description: string;
    location: Location;
}

export interface Payment{
    _id: string;
    amount: number;
    buyer: mongooseId;
    date: Date;
    stockDetails: Stock;
    success: boolean;
    transactionId: string;
}

export interface ReturnStocks {
    success: boolean;
    stocks: Stock[];
}


export interface SplitterStocks extends ReturnStocks{
    available: Stock[];
    unavailable: Stock[];
}

export type StockStatus = "available" | "unavailable";

export enum StockStatusEnum {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable",
    NEAR = "near",
    ALL = "all"
}
