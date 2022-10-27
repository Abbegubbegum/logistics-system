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

`POST /employees/`

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
201

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

`POST /employees/{name}/schedule/`

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
		"start": "23:00",
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

`GET /employees/`

Default gets all employees

#### Query Parameters

| Field          | Type   | Value                                                                                                             |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| day (optional) | String | A day in the 3 character format (mon, tue, wed, etc.). Returns only employees with a schedule working on that day |

### Response

```json
200

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

## Get a non-existent Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/9999

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Create another new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Bar&junk=rubbish' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/2
    Content-Length: 35

    {"id":2,"name":"Bar","status":null}

## Get list of Things again

### Request

`GET /thing/`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 74

    [{"id":1,"name":"Foo","status":"new"},{"id":2,"name":"Bar","status":null}]

## Change a Thing's state

### Request

`PUT /thing/:id/status/changed`

    curl -i -H 'Accept: application/json' -X PUT http://localhost:7000/thing/1/status/changed

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

    {"id":1,"name":"Foo","status":"changed"}

## Get changed Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

    {"id":1,"name":"Foo","status":"changed"}

## Change a Thing

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'name=Foo&status=changed2' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed2"}

## Attempt to change a Thing using partial params

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'status=changed3' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed3"}

## Attempt to change a Thing using invalid params

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'id=99&status=changed4' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed4"}

## Change a Thing using the \_method hack

### Request

`POST /thing/:id?_method=POST`

    curl -i -H 'Accept: application/json' -X POST -d 'name=Baz&_method=PUT' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Baz","status":"changed4"}

## Change a Thing using the \_method hack in the url

### Request

`POST /thing/:id?_method=POST`

    curl -i -H 'Accept: application/json' -X POST -d 'name=Qux' http://localhost:7000/thing/1?_method=PUT

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: text/html;charset=utf-8
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Delete a Thing

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X DELETE http://localhost:7000/thing/1/

### Response

    HTTP/1.1 204 No Content
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 204 No Content
    Connection: close

## Try to delete same Thing again

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X DELETE http://localhost:7000/thing/1/

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Get deleted Thing

### Request

`GET /thing/1`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:33 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Delete a Thing using the \_method hack

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X POST -d'_method=DELETE' http://localhost:7000/thing/2/

### Response

    HTTP/1.1 204 No Content
    Date: Thu, 24 Feb 2011 12:36:33 GMT
    Status: 204 No Content
    Connection: close
