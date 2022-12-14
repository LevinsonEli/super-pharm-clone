# super-pharm-clone

The original one you can see at [shop.super-pharm.co.il][super-pharm-original]

## v0.2

- **Added 'orders'.**
  - You can create an order and pay for it using [Stripe][stripe]
  - For every cart item 'product id' and 'amount' should be provided. All the product fields are gained from the DB and stored as order item inside order.
  - Every order contains:
    - Tax, Shipping Fee, Sub Total, Total
    - Items - list of order items. Every item contains:
      - Title
      - Price
      - Amount
      - Image
      - Amount
      - Product - the is of related product
    - User - the id of related user
    - Client Secret, Paiment Intent Id - for Stripe API
    - Status

- **Added 'statistics'.**
  - Every product have new fileds:
    - Number of Products
    - Everage Rating
  - Calculating implemented inside the 'Reviews' model via simple methods

- **Added 'categories'.**
  - You can relate every product to a category
  - Every category can contain other 'sub'-categories
  - Every category contains:
    - Title - name of the category
    - Description - optional, description, that viewed at the category page
    - Description Image - optional, image, that represents the category page
    - Thumbnail Image - optional, for representing table of sub-categories on main category page
    - Parent Category - optional, for sub-categories to be related to 'non-sub'-categories. Every category can have 'children' categories but main categories can not have 'parent' category

- **Added 'reviews'.** 
  - You can give a feedback for a product. 
  - Every user can provide only one review for every product. 
  - User must ber loged in to create one.
  - Every 'review' contains:
    - Rating - integer number in range (0, 5)
    - Comment - the text of the review
    - Product - the id of the related product
    - User - the id of the user

## v0.1

- **Added 'users'.**
  - The Router itself was created. 
  - All 'CRUD' operations avalable for users.

## v0.0

- **Added 'auth'.**
  - Login, Logout, Register endpoints.
  - Passwords secured by bcrypt library.
  - 'Authenticate User' and 'Authorize Permissions' middlewares.

- **Added 'products'**
  - Full 'CRUD' operations
  - Every product contains:
    - Title
    - Price

- **Initial setup was created**
  - Created [NodeJS][node-js] project
  - Using [Express][express] library for server
  - Using [MongoDB][mongo] + [Mongoose][mongoose] for DB
  - Initialized [Docker][docker] file
  - Created pipeline using GitHub Actions (GitHub Workflow)
  - Using [Jest][jest] for testing


[super-pharm-original]: https://shop.super-pharm.co.il/
[stripe]: https://stripe.com/
[node-js]: https://nodejs.org/en/
[express]: https://expressjs.com/
[mongo]: https://www.mongodb.com/
[mongoose]: https://mongoosejs.com/
[docker]: https://www.docker.com/
[jest]: https://jestjs.io/


