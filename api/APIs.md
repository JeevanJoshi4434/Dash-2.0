# User APIs

## Register User

Endpoint: `/api/user`

Method: `POST`

Request Body:

```json
{
  "name": "john doe",
  "email": "johndoe@example.com",
  "password": "example@123456",
  "type": "farmer",
  "location": {
    "latitude": 29.834268,
    "longitude": 79.772007
  }
}
```

Response:

```json
{
    // User's Object
}
```

## Login User

Endpoint: `/api/user/login`

Method: `POST`

Request Body:

```json
{
  "email": "johndoe@example.com",
  "password": "example@123456"
}
```

Response:

```json
{
    // User's Object
}