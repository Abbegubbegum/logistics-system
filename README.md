# REST API Logistics

Documentation for a Rest API handling Employees, Products and Orders for a Company.

It uses a MongoDB Database and a Node Server with Express as Data Endpoints.

It requires a MongoDB Database URL either at `mongodb://localhost/logistics` or defined in the .env variable `DB_URL`

## Install

    	npm install

## Build

    	npm run build

## Run the app

    	npm run serve

# REST API

The documentation on the available endpoints for the REST API.

# Employees

## Create a new Employee

### Request

`POST /employees`

Body

```json
{
	"name": "John Doe",
	"warehouse": "Warehouse1",
	"role": "Admin"
}
```

| Field     | Type   | Value                                                                  |
| --------- | ------ | ---------------------------------------------------------------------- |
| name      | string | Name of the Employee, must be unique                                   |
| warehouse | string | Name of an existing warehouse that the employee will be "connected" to |
| role      | string | Title of an existing role that the employee will be given              |

### Response

The response is the newly created employee object

```json
201 Created

{
	"name": "John Doe",
	"warehouse": "63567e7c8ad7840870ff0a56",
	"role": {
		"_id": "6357aa51a41aca5cf4b25628",
		"title": "Admin",
		"level": 5
	},
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "635a6bb6ff20a2093404c0bc",
	"__v": 0
}
```

| Field     | Type   | Value                                                                              |
| --------- | ------ | ---------------------------------------------------------------------------------- |
| name      | string | The name of the Employee                                                           |
| warehouse | string | The warehouse object id connected to the employee                                  |
| role      | object | The role document with the title, level and id                                     |
| schedule  | object | The schedule for the employee, default is an array of false booleans for each day. |
| id        | string | The id of the new employee document                                                |

#### Errors

| Code | Message                              | Meaning                                                                      |
| ---- | ------------------------------------ | ---------------------------------------------------------------------------- |
| 400  | Bad request, \_\_\_ must be a string | One of the fields in the request is the wrong type, or missing from the body |
| 400  | Employee with name already exists    | The name sent in already exists in the database, it needs to be unique       |
| 404  | Warehouse not found                  | A warehouse with the name sent in was not found in the database              |
| 404  | Role not found                       | A role with the title sent in was not found in the database                  |
| 500  | Internal Server Error                | An Unexpected internal server error has occured                              |

## Set Schedule for Employee

### Request

`POST /employees/{name}/schedule`

Body

```json
{
	"mon": {
		"start": "06:30",
		"end": "22:00"
	},
	"tue": {
		"start": "12:00",
		"end": "23:00"
	},
	"wed": {
		"start": "09:00",
		"end": "12:00"
	},
	"sun": {
		"start": "00:00",
		"end": "06:30"
	},
	"fri": {
		"start": "15:30",
		"end": "20:30"
	}
}
```

To set the schedule of a specific day, add that day as a field in the 3 character format (mon, tue, wed, thu, fri, sat, sun). That field must be an object containing a start and end field.

The start and end field must be a string and in the format of "hh:mm". The schedules are in timesteps of 30 minutes so the only allowed values are "hh:00" or "hh:30".

`ALL OTHER FIELDS OR INCORRECTLY FORMATTED VALUES ARE COMPLETELY IGNORED`

### Response

    	201 Created

#### Errors

| Code | Message               | Meaning                                                                  |
| ---- | --------------------- | ------------------------------------------------------------------------ |
| 404  | Employee not found    | An employee with the name of the parameter was not found in the database |
| 500  | Internal Server Error | An Unexpected internal server error has occured                          |

## Get multiple employees

### Request

`GET /employees`

Default gets all employees

#### Query Parameters

| Field          | Type   | Value                                                                                                             |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| day (optional) | string | A day in the 3 character format (mon, tue, wed, etc.). Returns only employees with a schedule working on that day |

### Response

```json
200 OK

[
{
	"name": "John Doe",
	"warehouse": "63567e7c8ad7840870ff0a56",
	"role": "6357aa51a41aca5cf4b25628",
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "635a6bb6ff20a2093404c0bc",
	"__v": 0
},
...]
```

Returns an array of employees that matched the request.

## Get employees working today

### Request

`GET /employees/today`

### Response

```json
200 OK

[
{
	"name": "John Doe",
	"warehouse": "63567e7c8ad7840870ff0a56",
	"role": "6357aa51a41aca5cf4b25628",
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "635a6bb6ff20a2093404c0bc",
	"__v": 0
},
...]
```

Returns an array of employees that in their schedule would work today.

## Get employees working at this time

### Request

`GET /employees/working`

### Response

```json
200 OK

[
{
	"name": "John Doe",
	"warehouse": "63567e7c8ad7840870ff0a56",
	"role": "6357aa51a41aca5cf4b25628",
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "635a6bb6ff20a2093404c0bc",
	"__v": 0
},
...]
```

Returns an array of employees that in their schedule would work right at the request.

## Get employee by name

### Request

`GET /employees/{name}`

### Response

```json
200 OK

{
	"name": "John Doe",
	"warehouse": {
		"name": "Warehouse1",
		"products": [...],
		"_id": "63567e7c8ad7840870ff0a56",
		"__v": 2
	},
	"role": {
		"_id": "6357aa51a41aca5cf4b25628",
		"title": "Admin",
		"level": 5
	},
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "6357aaae4bf7433827b6c191",
	"__v": 0
}
```

Returns the employee which name matches the name in the parameter

#### Errors

| Code | Message               | Meaning                                                                            |
| ---- | --------------------- | ---------------------------------------------------------------------------------- |
| 404  | Employee not found    | An employee with the name that matches the parameter was not found in the database |
| 500  | Internal Server Error | An Unexpected internal server error has occured                                    |

## Get employees working today

### Request

`GET /grabbers/working`

### Response

```json
200 OK

[
{
	"name": "John Doe",
	"warehouse": "63567e7c8ad7840870ff0a56",
	"role": {
		"_id": "6357aa51a41aca5cf4b25628",
		"title": "Grabber",
		"level": 1
	},
	"schedule": {
		"sun": [...],
		"mon": [...],
		"tue": [...],
		"wed": [...],
		"thu": [...],
		"fri": [...],
		"sat": [...]
	},
	"_id": "635a6bb6ff20a2093404c0bc",
	"__v": 0
},
...]
```

Returns an array of employees that would work right at the request and which role also has the title of grabber.

## Delete all employees

### Request

`DELETE /employees`

### Response

    	200 OK

Deletes all employee documents

## Delete employee with name

### Request

`DELETE /employees/{name}`

### Response

    	200 OK

Deletes the employee document that matches the name

#### Errors

| Code | Message               | Meaning                                                                            |
| ---- | --------------------- | ---------------------------------------------------------------------------------- |
| 404  | Employee not found    | An employee with the name that matches the parameter was not found in the database |
| 500  | Internal Server Error | An Unexpected internal server error has occured                                    |

# Warehouses

## Create new warehouse

### Request

`POST /warehouses`

```json
{
	"name": "Warehouse1"
}
```

| Field | Type   | Value                                 |
| ----- | ------ | ------------------------------------- |
| name  | string | Name of the warehouse, must be unique |

### Response

```json
201 Created

{
	"name": "Warehouse1",
	"products": [],
	"_id": "635b81c7881d4487c5234df0",
	"__v": 0
}
```

| Field    | Type   | Value                                            |
| -------- | ------ | ------------------------------------------------ |
| name     | string | The name of the Warehouse                        |
| products | array  | An array of products that the warehouse contains |
| id       | string | The id of the new warehouse document             |

#### Errors

| Code | Message                            | Meaning                                                                   |
| ---- | ---------------------------------- | ------------------------------------------------------------------------- |
| 400  | Bad request, name must be a string | The name field in the request is the wrong type, or missing from the body |
| 400  | Warehouse with name already exists | The name sent in already exists in the database, it needs to be unique    |
| 500  | Internal Server Error              | An Unexpected internal server error has occured                           |

## Add product to warehouse

### Request

`PUT /warehouses/{name}/products`

```json
{
	"product": "Ball",
	"quantity": 4,
	"shelfID": "5C"
}
```

| Field    | Type   | Value                                                              |
| -------- | ------ | ------------------------------------------------------------------ |
| product  | string | Name of the existing product that should be added to the warehouse |
| quantity | number | The quantity of the product that exists in the warehouse           |
| shelfID  | string | A string used to sort and keep track of items in the warehouse     |

### Response

The response is the newly created product object

```json
201 Created

{
	"product": {
		"_id": "6357a92e4bf7433827b6c144",
		"name": "Ball",
		"price": 99,
		"weight": 3,
		"__v": 0
	},
	"quantity": 4,
	"shelfID": "5C",
	"_id": "635b85e991e8c27578c651cc"
}
```

| Field    | Type   | Value                                              |
| -------- | ------ | -------------------------------------------------- |
| product  | object | The product document with a name, price and weight |
| quantity | number | The entered quantity                               |
| shelfID  | string | The entered shelfID                                |
| id       | string | The id for the document                            |

#### Errors

| Code | Message                              | Meaning                                                                      |
| ---- | ------------------------------------ | ---------------------------------------------------------------------------- |
| 400  | Bad request, \_\_\_ must be a \_\_\_ | One of the fields in the request is the wrong type, or missing from the body |
| 404  | Product not found                    | A product with the entered name was not found in the database                |
| 404  | Warehouse not found                  | A warehouse with the name of the parameter was not found in the database     |
| 500  | Internal Server Error                | An Unexpected internal server error has occured                              |

## Get all warehouses

### Request

`GET /warehouses`

### Response

```json
200 OK

[
	{
		"name": "Warehouse1",
		"products": [
			{
				"product": {
					"_id": "6357a92e4bf7433827b6c144",
					"name": "Ball",
					"price": 99,
					"weight": 3,
					"__v": 0
				},
				"quantity": 4,
				"shelfID": "5C",
				"_id": "635b85e991e8c27578c651cc"
			},
		...
		],
		"_id": "635b81c7881d4487c5234df0",
		"__v": 0
	},
...
]
```

Returns an array of all warehouses in the database

# Products

## Create new product

### Request

`POST /products`

```json
{
	"name": "Ball",
	"price": 99,
	"weight": 3
}
```

| Field             | Type   | Value                                    |
| ----------------- | ------ | ---------------------------------------- |
| name              | string | Name of the product, must be unique      |
| price (optional)  | number | The price of this product, default is 0  |
| weight (optional) | number | The weight of this product, default is 0 |

### Response

Returns the created document

```json
201 Created

{
	"name": "Ball",
	"price": 99,
	"weight": 3,
	"_id": "6357a92e4bf7433827b6c144",
	"__v": 0
},
```

#### Errors

| Code | Message                                           | Meaning                                                                   |
| ---- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| 400  | Bad request, name must be a string                | The name field in the request is the wrong type, or missing from the body |
| 400  | Bad request, \_\_\_ must be a number or undefined | One of the fields sent is the wrong type                                  |
| 400  | Product with name already exists                  | A product with the name already exists in the database                    |
| 500  | Internal Server Error                             | An Unexpected internal server error has occured                           |

## Get products available stock

### Request

`GET /products/{product}/stock`

### Response

Returns an array of the warehouses which has the specified product in its products

```json
200 OK

[
	{
		"name": "Warehouse1",
		"products": [
			{
				"product": {
					"_id": "6357a92e4bf7433827b6c144",
					"name": "Ball",
					"price": 99,
					"weight": 3,
					"__v": 0
				},
				"quantity": 4,
				"shelfID": "5C",
				"_id": "635b85e991e8c27578c651cc"
			},
		...
		],
		"_id": "635b81c7881d4487c5234df0",
		"__v": 0
	},
...
]
```

# Orders

## Create new order

### Request

`POST /orders`

```json
{
	"products": [
	{
	 "name": "Ball",
	 "quantity": 4,
	},
	...
	]
}
```

| Field    | Type   | Value                                                             |
| -------- | ------ | ----------------------------------------------------------------- |
| products | array  | An arraw of the products and the quantity that the order contains |
| name     | string | The name of the existing product                                  |
| quantity | number | The amount of the product in the order                            |

### Response

```json
201 Created

{
	"products": [
	{
		"product": {
			"name": "Ball",
			"price": 99,
			"weight": 3,
			"_id": "636026f2a70d8dee88856f09",
			"__v": 0
		},
		"quantity": 4,
		"_id": "63602772ff22aaf86248e00d"
	}
	],
	"cost": 396,
	"created_at": "2022-10-31T19:52:18.848Z",
	"_id": "63602772ff22aaf86248e00c",
	"__v": 0
}
```

| Field      | Type   | Value                                           |
| ---------- | ------ | ----------------------------------------------- |
| products   | array  | An array of products that the order contains    |
| product    | object | The document of the product from the name field |
| quantity   | number | The quantity of the ordered product             |
| cost       | number | The accumilated cost of the entire order        |
| created_at | Date   | The created timestamp for the order             |
| id         | string | The id of the new order document                |

#### Errors

| Code | Message                                                | Meaning                                                                         |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 400  | Bad request, Order Products must be an array           | The products field in the request is the wrong type, or missing from the body   |
| 400  | Bad request, Order needs at least one product          | The products field array in the request is empty                                |
| 400  | Bad request at index \_\_\_, Product must be an object | A product element in the array is the wrong type                                |
| 400  | Bad request at index \_\_\_, \_\_\_ must be a \_\_\_   | A field in a product element in the array is the wrong type, or is missing      |
| 404  | Bad request at index \_\_\_, couldn't find product     | The name field in a product element in the array does not exist in the database |
| 500  | Internal Server Error                                  | An Unexpected internal server error has occured                                 |

## Assign grabber to order

### Request

`PUT /orders/{orderID}/grabber`

```json
{
	"name": "John Smith"
}
```

| Field | Type   | Value                                                                                            |
| ----- | ------ | ------------------------------------------------------------------------------------------------ |
| name  | string | The name of the existing employee with a role with the title of "grabber" to assign to the order |

### Response

    	200 OK

#### Errors

| Code | Message                              | Meaning                                                                   |
| ---- | ------------------------------------ | ------------------------------------------------------------------------- |
| 400  | Bad Request, invalid order ID        | The orderID parameter in the request is not a valid document id           |
| 404  | Order not found                      | An order with the id of the parameter was not found in the database       |
| 400  | Bad request, name must be a string   | The name field in the request is the wrong type, or missing from the body |
| 400  | Order already has a grabber assigned | The order already has a grabber employee assigned                         |
| 400  | Order is already packed              | The order is already packed                                               |
| 400  | Employee is not a grabber            | The employees role title was not "grabber"                                |
| 404  | Employee not found                   | An employee with the name of the field was not found in the database      |
| 500  | Internal Server Error                | An Unexpected internal server error has occured                           |

## Set the order as packed

### Request

`PUT /orders/{orderID}/packed`

### Response

    	200 OK

#### Errors

| Code | Message                              | Meaning                                                             |
| ---- | ------------------------------------ | ------------------------------------------------------------------- |
| 400  | Bad Request, invalid order ID        | The orderID parameter in the request is not a valid document id     |
| 404  | Order not found                      | An order with the id of the parameter was not found in the database |
| 400  | Order doesn't have a grabber asigned | The order does not have a grabber assigned                          |
| 400  | Order is already packed              | The order is already packed                                         |
| 500  | Internal Server Error                | An Unexpected internal server error has occured                     |

## Assign driver to order

### Request

`PUT /orders/{orderID}/driver`

```json
{
	"name": "John Williams"
}
```

| Field | Type   | Value                                                                                           |
| ----- | ------ | ----------------------------------------------------------------------------------------------- |
| name  | string | The name of the existing employee with a role with the title of "driver" to assign to the order |

### Response

    	200 OK

#### Errors

| Code | Message                             | Meaning                                                                   |
| ---- | ----------------------------------- | ------------------------------------------------------------------------- |
| 400  | Bad Request, invalid order ID       | The orderID parameter in the request is not a valid document id           |
| 404  | Order not found                     | An order with the id of the parameter was not found in the database       |
| 400  | Bad request, name must be a string  | The name field in the request is the wrong type, or missing from the body |
| 400  | Order already has a driver assigned | The order already has a driver employee assigned                          |
| 400  | Order is already delivered          | The order is already delivered                                            |
| 400  | Employee is not a driver            | The employees role title was not "driver"                                 |
| 404  | Employee not found                  | An employee with the name of the field was not found in the database      |
| 500  | Internal Server Error               | An Unexpected internal server error has occured                           |

## Set the order as delivered

### Request

`PUT /orders/{orderID}/delivered`

### Response

    	200 OK

#### Errors

| Code | Message                              | Meaning                                                             |
| ---- | ------------------------------------ | ------------------------------------------------------------------- |
| 400  | Bad Request, invalid order ID        | The orderID parameter in the request is not a valid document id     |
| 404  | Order not found                      | An order with the id of the parameter was not found in the database |
| 400  | Order doesn't have a driver assigned | The order does not have a driver assigned                           |
| 400  | Order is already delivered           | The order is already delivered                                      |
| 500  | Internal Server Error                | An Unexpected internal server error has occured                     |

## Get orders

### Request

`GET /orders`

Default gets all orders in the database

#### Query Parameters

| Field            | Type   | Value                                                                                    |
| ---------------- | ------ | ---------------------------------------------------------------------------------------- |
| month (optional) | number | The month number which limits the search to orders created in that month this year       |
| sum (optional)   | any    | If the sum parameter exists, it returns only the sum of cost of the orders in the search |

### Response

Returns an array of all orders in the database if sum was not provided

```json
200 OK

[
	{
		"products": [
			{
				"product": "636026f2a70d8dee88856f09",
				"quantity": 4,
				"_id": "63602772ff22aaf86248e00d"
			}
		],
		"cost": 396,
		"created_at": "2022-10-31T19:52:18.848Z",
		"grabber": "636026f2a70d8dee88852ee",
		"packed_at": "2022-10-31T20:00:42.329Z",
		"driver": "636026f2a70d8dee823ac5",
		"delivered_at": "2022-10-31T20:25:06.940Z",
		"_id": "63602772ff22aaf86248e00c",
		"__v": 0
	},
	...
]
```

| Field         | Type   | Value                                           |
| ------------- | ------ | ----------------------------------------------- |
| products      | array  | An array of products that the order contains    |
| product       | object | The document of the product from the name field |
| quantity      | number | The quantity of the ordered product             |
| cost          | number | The accumilated cost of the entire order        |
| created_at    | Date   | The created timestamp for the order             |
| grabber?      | string | The id of the assigned grabber employee         |
| packed_at?    | Date   | The timestamp for when the order was packed     |
| driver?       | string | The id of the assigned driver employee          |
| delivered_at? | Date   | The timestamp for when the order was delivered  |
| id            | string | The id of the new order document                |

Returns a sum of costs if sum was provided

```json
200 OK

{
	"cost": 6723
}
```

## Get a formatted list of all orders

### Request

`GET /orders/list`

### Response

```json
200 OK

[
	{
		"id": "6357abf24bf7433827b6c195",
		"status": "AWAITING_FULFILLMENT"
	},
	{
		"id": "6357ac0c4bf7433827b6c19a",
		"status": "PACKING"
	},
	{
		"id": "6357ac154bf7433827b6c19e",
		"status": "AWAITING_SHIPMENT"
	},
	{
		"id": "6360275fa70d8dee88856f0c",
		"status": "SHIPPED"
	},
	{
		"id": "63602772ff22aaf86248e00c",
		"status": "DELIVERED"
	},
	...
]
```

| Status               | Meaning                                                        |
| -------------------- | -------------------------------------------------------------- |
| AWAITING_FULFILLMENT | The order has not yet been assigned a grabber                  |
| PACKING              | The order has a grabber assigned but is not yet packed         |
| AWAITING_SHIPMENT    | The order is packed and is waiting for a driver to be assigned |
| SHIPPED              | The order has a driver assigned but is not yet delivered       |
| DELIVERED            | The order is delivered                                         |
| UNDEFINED            | An unexpected error has occurred                               |

## Get most expensive order

### Request

`GET /orders/mostexpensive`

Default gets the most expensive order of all time

#### Query Parameters

| Field            | Type   | Value                                                                              |
| ---------------- | ------ | ---------------------------------------------------------------------------------- |
| month (optional) | number | The month number which limits the search to most expensive of that month this year |

### Response

```json
200 OK

{
	"products": [
	{
		"product": {
			"name": "Ball",
			"price": 99,
			"weight": 3,
			"_id": "636026f2a70d8dee88856f09",
			"__v": 0
		},
		"quantity": 4,
		"_id": "63602772ff22aaf86248e00d"
	}
	],
	"cost": 396,
	"created_at": "2022-10-31T19:52:18.848Z",
	"_id": "63602772ff22aaf86248e00c",
	"__v": 0
}
```

Returns the order document that matched the request

## Get all unpacked orders

### Request

`GET /orders/unpacked`

### Response

```json
200 OK

[
	{
		"products": [
		{
			"product": {
				"name": "Ball",
				"price": 99,
				"weight": 3,
				"_id": "636026f2a70d8dee88856f09",
				"__v": 0
			},
			"quantity": 4,
			"_id": "63602772ff22aaf86248e00d"
		}
		],
		"cost": 396,
		"created_at": "2022-10-31T19:52:18.848Z",
		"_id": "63602772ff22aaf86248e00c",
		"__v": 0
	},
...
]
```

Returns an array of all orders that are not packed and do not have an assigned grabber

## Get the oldest unpacked orders

### Request

`GET /orders/unpacked/oldest`

### Response

```json
200 OK

{
	"products": [
	{
		"product": {
			"name": "Ball",
			"price": 99,
			"weight": 3,
			"_id": "636026f2a70d8dee88856f09",
			"__v": 0
		},
		"quantity": 4,
		"_id": "63602772ff22aaf86248e00d"
	}
	],
	"cost": 396,
	"created_at": "2022-10-31T19:52:18.848Z",
	"_id": "63602772ff22aaf86248e00c",
	"__v": 0
}
```

Returns the oldest created order that is not packed and do not have an assigned grabber

## Get all packed orders

### Request

`GET /orders/packed`

### Response

```json
200 OK

[
	{
		"products": [
			{
				"product": {
					"name": "Ball",
					"price": 99,
					"weight": 3,
					"_id": "636026f2a70d8dee88856f09",
					"__v": 0
				},
				"quantity": 4,
				"_id": "63602772ff22aaf86248e00d"
			},
		...
		],
		"cost": 12397,
		"created_at": "2022-10-25T09:27:14.315Z",
		"grabber": {
			"name": "John Smith",
			"warehouse": {
				"name": "Warehouse1",
				"_id": "6357a8a5a41aca5cf4b2561e"
			},
			"role": "6357aa3fa41aca5cf4b25627",
			"_id": "6357aa8d4bf7433827b6c17e",
			"__v": 0
		},
		"packed_at": "2022-10-31T21:12:13.796Z",
		"_id": "6357abf24bf7433827b6c195",
		"__v": 0
	}
...
]
```

Returns an array of all orders that are packed but do not have a driver assigned or is not delivered

## Get all packed orders

### Request

`GET /orders/packed/oldest`

### Response

```json
200 OK

{
	"products": [
		{
			"product": {
				"name": "Ball",
				"price": 99,
				"weight": 3,
				"_id": "636026f2a70d8dee88856f09",
				"__v": 0
			},
			"quantity": 4,
			"_id": "63602772ff22aaf86248e00d"
		},
	...
	],
	"cost": 12397,
	"created_at": "2022-10-25T09:27:14.315Z",
	"grabber": {
		"name": "John Smith",
		"warehouse": {
			"name": "Warehouse1",
			"_id": "6357a8a5a41aca5cf4b2561e"
		},
		"role": "6357aa3fa41aca5cf4b25627",
		"_id": "6357aa8d4bf7433827b6c17e",
		"__v": 0
	},
	"packed_at": "2022-10-31T21:12:13.796Z",
	"_id": "6357abf24bf7433827b6c195",
	"__v": 0
}
```

Returns the oldest created order that is packed but do not have a driver assigned or is not delivered
