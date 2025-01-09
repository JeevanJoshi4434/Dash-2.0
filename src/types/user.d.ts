type UserType = 'farmer' | 'buyer' | 'admin';

type StocksId = string;

type SALT = number | string;

interface Location {
  type: string;
  coordinates: number[];
}


type UserValidFields = 'id' | 'name' | 'email' | 'password' | 'type' | 'location' | 'lastActive' | 'stocks' | 'payments';

interface BaseUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  lastActive: Date;
  location: Location;
  isModified: boolean;
}

// Farmer user interface
interface Farmer extends BaseUser {
  type: 'farmer';
  stocks: StocksId[]; // Farmers must have stocks
  payments?: never; // Farmers shouldn't have payments
}

// Buyer user interface
interface Buyer extends BaseUser {
  type: 'buyer';
  stocks?: never; // Buyers shouldn't have stocks
  payments: string[]; // Buyers must have payments
}

// Admin user interface
interface Admin extends BaseUser {
  type: 'admin';
  stocks?: never; // Admins shouldn't have stocks
  payments?: never; // Admins shouldn't have payments
}

// Union type for all user types
type IUser = Farmer | Buyer | Admin;

export { IUser, UserType, StocksId, Location, SALT, UserValidFields };
