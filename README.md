
# API Gateway Node Express

A simple API Gateway made using Node and Express.


## API Reference
wip

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.
wip


## Tech Stack

**Server:** Node, Express, Axios, Helmet


## Related

Here are some related projects

[Express JS - Creating An API Gateway](https://www.youtube.com/playlist?list=PLMFjx2r0Yjipjl31vnoFnUt5tnN50SCAb)


## License

[MIT](https://choosealicense.com/licenses/mit/)

