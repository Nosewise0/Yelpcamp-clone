# YelpCamp

YelpCamp is a server-rendered campground discovery and listing website. Users can browse campsite listings, view locations on interactive maps, create accounts, publish their own campgrounds, upload photos, and leave reviews.

The application uses an Airbnb-inspired interface while keeping the core YelpCamp campground marketplace workflow.

## Features

- Browse campground listings in a responsive card-based layout
- Search and filter listings by text and price from the campground index
- View campground details, photos, descriptions, prices, authors, reviews, and maps
- Create an account with user registration (including confirm password validation and visibility toggling)
- Authenticate with Passport local authentication with remember-return redirection
- Create, edit, and delete campground listings
- Upload one or more campground photos to Cloudinary
- Geocode campground locations with MapTiler
- View campground locations on MapTiler maps
- Add and delete reviews with ratings from 1 to 5
- Restrict listing and review management to authenticated users and their owners
- Client and server-side form validation with visual feedback on all required fields
- Validate and sanitize campground and review form input
- Display session-based success and error flash messages
- Serve static assets from the `public` directory
- Deploy the Express application through Vercel

## Technology Stack

### Server

- Node.js
- Express 4
- MongoDB with Mongoose
- EJS templates with EJS Mate layouts
- Passport and Passport Local for authentication
- Express Session with MongoDB-backed session storage

### Integrations

- Cloudinary for campground image storage
- MapTiler geocoding and map tiles
- Bootstrap 5 and Bootstrap Icons

### Security and validation

- Helmet security headers and Content Security Policy
- `express-mongo-sanitize` for MongoDB query sanitization
- Joi request validation
- `sanitize-html` to reject HTML in user-entered text
- HTTP-only session cookies

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database, either local or hosted
- Cloudinary account for image uploads
- MapTiler API key for location geocoding and maps

## Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd yelpcamp
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root.

   ```env
   DB_URL=mongodb://127.0.0.1:27017/yelpcamp
   SESSION_SECRET=replace-with-a-long-random-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   MAPTILER_API_KEY=your-maptiler-api-key
   PORT=3000
   ```

   `PORT` is optional and defaults to `3000`. The other values are required for the corresponding database, session, upload, and map functionality.

4. Start the application.

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Commands

| Command | Description |
| --- | --- |
| `npm install` | Install project dependencies |
| `npm start` | Start the Express server |
| `npm test` | Placeholder command; automated tests are not currently configured |

## Website Routes

### Public pages

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Home page |
| `GET` | `/campgrounds` | Browse all campgrounds |
| `GET` | `/campgrounds/:id` | View a campground |
| `GET` | `/help` | Help page |
| `GET` | `/about` | About page |
| `GET` | `/aircover` | AirCover information page |
| `GET` | `/hosting` | Hosting information page |
| `GET` | `/privacy` | Privacy page |
| `GET` | `/terms` | Terms page |
| `GET` | `/register` | Registration form |
| `POST` | `/register` | Create an account |
| `GET` | `/login` | Login form |
| `POST` | `/login` | Authenticate a user |
| `GET` | `/logout` | End the current session |

### Campground management

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/campgrounds/new` | Signed in | Display the new listing form |
| `POST` | `/campgrounds` | Signed in | Create a campground and upload images |
| `GET` | `/campgrounds/:id/edit` | Listing author | Display the edit form |
| `PUT` | `/campgrounds/:id` | Listing author | Update listing details and add images |
| `DELETE` | `/campgrounds/:id` | Listing author | Delete a campground and its reviews |

Forms use `method-override` when they need to submit `PUT` or `DELETE` requests from standard HTML forms.

### Review management

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/campgrounds/:id/reviews` | Signed in | Add a rating and review |
| `DELETE` | `/campgrounds/:id/reviews/:reviewId` | Review author | Delete a review |

## User Flows

### Finding a campground

1. Visit the home page or campground index.
2. Browse listing cards or use the available search and filter controls.
3. Open a listing to view its photos, location, map, description, price, host, and reviews.

### Hosting a campground

1. Register or log in.
2. Select the host listing action.
3. Enter a title, location, nightly price, and description.
4. Select one or more images.
5. Submit the form.

The server sends the location to MapTiler for geocoding and stores the resulting GeoJSON Point. Images are uploaded to Cloudinary before the campground is saved.

### Managing a listing

Only the campground author can access its edit and delete actions. Editing can update text fields, add more images, and remove existing Cloudinary images.

### Reviewing a campground

Authenticated users can submit a 1-to-5 rating and review body. Review authors can remove their own reviews. Deleting a campground also removes its associated reviews through a Mongoose post-delete hook.

## Data Models

### User

- `username` and password fields supplied by Passport Local Mongoose
- Required, unique `email`
- Referenced by campgrounds and reviews

### Campground

- `title`
- `image[]`, containing Cloudinary `url` and `filename`
- `price`
- `description`
- Geocoded `location`
- GeoJSON `geometry` with a required `Point` type and coordinates
- `author`, referencing a User
- `reviews[]`, referencing Review documents

### Review

- `body`
- `rating`
- `author`, referencing a User

## Project Structure

```text
app.js                    Express application and middleware setup
middleware.js             Authentication, ownership, and validation middleware
schemas.js                Joi campground and review schemas
cloudinary/               Cloudinary configuration and upload storage
controllers/              Request handlers for users, campgrounds, and reviews
models/                   Mongoose User, Campground, and Review models
routes/                   Express route modules
seeds/                    Sample campground data and seed helpers
utils/                    Async error wrapper and custom Express errors
views/                    EJS pages, layouts, and partials
public/                   CSS, client-side JavaScript, and static images
vercel.json               Vercel deployment configuration
```

## Validation and Access Control

### Form Validation
- **User Registration**: Requires a unique username, valid email, password (min. 6 characters), and matching confirm password. Handled with client-side match checking (`validateForms.js`), interactive show/hide toggles (`passwordVisibility.js`), and server-side verification (`controllers/user.js`).
- **User Login**: Requires username and password with inline validation feedback and show/hide visibility toggles.
- **Campgrounds**: Creation and updates require a title, non-negative price, location, description, and at least one image on creation.
- **Reviews**: Submissions require a rating between 1 and 5 and a non-empty review body.
- **Visual Feedback**: Segmented inputs and forms integrate Bootstrap `was-validated` state styling with inline error messaging and error highlights.
- **Sanitization**: User-entered text is sanitized using `sanitize-html` and `express-mongo-sanitize` to reject HTML tags and protect against injection attacks.

### Access Control
The `isloggedin` middleware redirects anonymous users to `/login` and remembers the page they tried to access. `isAuthor` and `isReviewAuthor` prevent users from modifying content owned by someone else.

## Seeding Sample Data

The seed script is located at `seeds/index.js` and creates 50 sample campgrounds using cities from `seeds/cities.js`.

Run it with:

```bash
node seeds/index.js
```

The current seed script connects to the local database `mongodb://localhost:27017/yelpcamp`, clears existing campground documents, and assigns them to a hard-coded user ID. Create or update that user in the database before relying on seeded author references. Run the seed script carefully because it deletes existing campground data.

## Deployment

The repository includes `vercel.json` configured to build `app.js` with `@vercel/node` and route requests to the Express application.

For deployment, configure the following environment variables in the hosting provider:

```env
DB_URL=your-production-mongodb-connection-string
SESSION_SECRET=your-production-session-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret
MAPTILER_API_KEY=your-maptiler-api-key
```

Use a hosted MongoDB instance for production. The application stores sessions in MongoDB through `connect-mongo`, so the deployment must be able to connect to the configured database.

## Notes and Limitations

- Automated tests have not been added yet; `npm test` is currently a placeholder.
- The home page includes fixed marketing-style statistics and destination content.
- Search and filter behavior is implemented on the campground index page and is client-side.
- Campground ratings shown in parts of the interface currently use presentation values rather than an aggregate calculated from review documents.
- The application includes a `/fakeuser` helper endpoint in `app.js`; protect or remove it before production use.
- Image upload configuration currently allows JPEG and PNG formats through Cloudinary storage.

## License

No project-specific license has been declared. The `package.json` currently uses the `ISC` license field.
# YelpCamp

YelpCamp is a server-rendered campground discovery and listing website. Users can browse campsite listings, view locations on interactive maps, create accounts, publish their own campgrounds, upload photos, and leave reviews.

The application uses an Airbnb-inspired interface while keeping the core YelpCamp campground marketplace workflow.

## Features

- Browse campground listings in a responsive card-based layout
- Search and filter listings by text and price from the campground index
- View campground details, photos, descriptions, prices, authors, reviews, and maps
- Create an account and authenticate with Passport local authentication
- Create, edit, and delete campground listings
- Upload one or more campground photos to Cloudinary
- Geocode campground locations with MapTiler
- View campground locations on MapTiler maps
- Add and delete reviews with ratings from 1 to 5
- Restrict listing and review management to authenticated users and their owners
- Validate and sanitize campground and review form input
- Display session-based success and error flash messages
- Serve static assets from the `public` directory
- Deploy the Express application through Vercel

## Technology Stack

### Server

- Node.js
- Express 4
- MongoDB with Mongoose
- EJS templates with EJS Mate layouts
- Passport and Passport Local for authentication
- Express Session with MongoDB-backed session storage

### Integrations

- Cloudinary for campground image storage
- MapTiler geocoding and map tiles
- Bootstrap 5 and Bootstrap Icons

### Security and validation

- Helmet security headers and Content Security Policy
- `express-mongo-sanitize` for MongoDB query sanitization
- Joi request validation
- `sanitize-html` to reject HTML in user-entered text
- HTTP-only session cookies

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database, either local or hosted
- Cloudinary account for image uploads
- MapTiler API key for location geocoding and maps

## Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd yelpcamp
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root.

   ```env
   DB_URL=mongodb://127.0.0.1:27017/yelpcamp
   SESSION_SECRET=replace-with-a-long-random-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   MAPTILER_API_KEY=your-maptiler-api-key
   PORT=3000
   ```

   `PORT` is optional and defaults to `3000`. The other values are required for the corresponding database, session, upload, and map functionality.

4. Start the application.

   ```bash
   npm start
   ```

5. Open http://localhost:3000 in a browser.

## Available Commands

| Command | Description |
| --- | --- |
| `npm install` | Install project dependencies |
| `npm start` | Start the Express server |
| `npm test` | Placeholder command; automated tests are not currently configured |

## Website Routes

### Public pages

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Home page |
| `GET` | `/campgrounds` | Browse all campgrounds |
| `GET` | `/campgrounds/:id` | View a campground |
| `GET` | `/help` | Help page |
| `GET` | `/about` | About page |
| `GET` | `/aircover` | AirCover information page |
| `GET` | `/hosting` | Hosting information page |
| `GET` | `/privacy` | Privacy page |
| `GET` | `/terms` | Terms page |
| `GET` | `/register` | Registration form |
| `POST` | `/register` | Create an account |
| `GET` | `/login` | Login form |
| `POST` | `/login` | Authenticate a user |
| `GET` | `/logout` | End the current session |

### Campground management

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/campgrounds/new` | Signed in | Display the new listing form |
| `POST` | `/campgrounds` | Signed in | Create a campground and upload images |
| `GET` | `/campgrounds/:id/edit` | Listing author | Display the edit form |
| `PUT` | `/campgrounds/:id` | Listing author | Update listing details and add images |
| `DELETE` | `/campgrounds/:id` | Listing author | Delete a campground and its reviews |

Forms use `method-override` when they need to submit `PUT` or `DELETE` requests from standard HTML forms.

### Review management

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/campgrounds/:id/reviews` | Signed in | Add a rating and review |
| `DELETE` | `/campgrounds/:id/reviews/:reviewId` | Review author | Delete a review |

## User Flows

### Finding a campground

1. Visit the home page or campground index.
2. Browse listing cards or use the available search and filter controls.
3. Open a listing to view its photos, location, map, description, price, host, and reviews.

### Hosting a campground

1. Register or log in.
2. Select the host listing action.
3. Enter a title, location, nightly price, and description.
4. Select one or more images.
5. Submit the form.

The server sends the location to MapTiler for geocoding and stores the resulting GeoJSON Point. Images are uploaded to Cloudinary before the campground is saved.

### Managing a listing

Only the campground author can access its edit and delete actions. Editing can update text fields, add more images, and remove existing Cloudinary images.

### Reviewing a campground

Authenticated users can submit a 1-to-5 rating and review body. Review authors can remove their own reviews. Deleting a campground also removes its associated reviews through a Mongoose post-delete hook.

## Data Models

### User

- `username` and password fields supplied by Passport Local Mongoose
- Required, unique `email`
- Referenced by campgrounds and reviews

### Campground

- `title`
- `image[]`, containing Cloudinary `url` and `filename`
- `price`
- `description`
- Geocoded `location`
- GeoJSON `geometry` with a required `Point` type and coordinates
- `author`, referencing a User
- `reviews[]`, referencing Review documents

### Review

- `body`
- `rating`
- `author`, referencing a User

## Project Structure

```text
app.js                    Express application and middleware setup
middleware.js             Authentication, ownership, and validation middleware
schemas.js                Joi campground and review schemas
cloudinary/               Cloudinary configuration and upload storage
controllers/              Request handlers for users, campgrounds, and reviews
models/                   Mongoose User, Campground, and Review models
routes/                   Express route modules
seeds/                    Sample campground data and seed helpers
utils/                    Async error wrapper and custom Express errors
views/                    EJS pages, layouts, and partials
public/                   CSS, client-side JavaScript, and static images
vercel.json               Vercel deployment configuration
```

## Validation and Access Control

Campground creation and updates require a title, non-negative price, location, and description. Review submissions require a rating between 1 and 5 and a review body. User-entered text is sanitized so HTML is not accepted.

The `isloggedin` middleware redirects anonymous users to `/login` and remembers the page they tried to access. `isAuthor` and `isReviewAuthor` prevent users from modifying content owned by someone else.

## Seeding Sample Data

The seed script is located at `seeds/index.js` and creates 50 sample campgrounds using cities from `seeds/cities.js`.

Run it with:

```bash
node seeds/index.js
```

The current seed script connects to the local database `mongodb://localhost:27017/yelpcamp`, clears existing campground documents, and assigns them to a hard-coded user ID. Create or update that user in the database before relying on seeded author references. Run the seed script carefully because it deletes existing campground data.

## Deployment

The repository includes `vercel.json` configured to build `app.js` with `@vercel/node` and route requests to the Express application.

For deployment, configure the following environment variables in the hosting provider:

```env
DB_URL=your-production-mongodb-connection-string
SESSION_SECRET=your-production-session-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret
MAPTILER_API_KEY=your-maptiler-api-key
```

Use a hosted MongoDB instance for production. The application stores sessions in MongoDB through `connect-mongo`, so the deployment must be able to connect to the configured database.

## Notes and Limitations

- Automated tests have not been added yet; `npm test` is currently a placeholder.
- The home page includes fixed marketing-style statistics and destination content.
- Search and filter behavior is implemented on the campground index page and is client-side.
- Campground ratings shown in parts of the interface currently use presentation values rather than an aggregate calculated from review documents.
- The application includes a `/fakeuser` helper endpoint in `app.js`; protect or remove it before production use.
- Image upload configuration currently allows JPEG and PNG formats through Cloudinary storage.

## License

No project-specific license has been declared. The `package.json` currently uses the `ISC` license field.
