# Eventure: Your Music Adventure Starts Here 🎶
Welcome to Eventure, an event platform targeted at helping to connect you with all the latest events across the globe and locally.

## Project Summary 📚
Built using Next.js 15, Eventure is a comprehensive, full-stack events platform created to allow music lovers to discover global or local events, and also provides a platform for event organisers to share their events with the community. This project demonstrates features such as Stripe API integration, Ticketmaster Event data integration, and the ability to create and manage your own events - in addition to being continuously deployed through Vercel for ease.

* As a user, you can sign-up or login, browse events from both Eventure and Ticketmaster, and use the convenient search and filter option to find the perfect event for you.

### Hosted Version
Find my live webpage [here](https://eventure-rouge.vercel.app).
*Please note: servers may be slow depending on your setup - please use with patience!*

## Tech Stack & Requirements 🤖
* TypeScript
* Next.js (minimum version: 15.0.0)
* Node.js (minimum version: 20.0.0)
* MongoDB (a MongoDB database & free API key is required - please refer to their docs [here](https://www.mongodb.com/docs/atlas/getting-started/) for setup)
* Stripe (a Stripe API key for their service is required - please follow their docs [here](https://docs.stripe.com/checkout/quickstart))
* Ticketmaster (a free API key for their Discovery API is required - please follow their docs [here](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/))
* Tailwind CSS
* Clerk
* Zod
* React Hook Form
* Shadcn
* uploadthing
* Hosted on Vercel
* Insomnia
* Chrome dev tools (including Lighthouse)

## Features ⚙️
* **Authentication and CRUD functionality with Clerk:** full user management, ensuring secure and efficient authentication

* **Events (CRUD):** Fully comprehensive funtionality to create, read, update, and delete events, giving users full control over events made on Eventure.
- **Create Events:** Users can easily create new events, providing essential details such as title, date, location, and any additional information.
- **Read Events:** Seamless access to a detailed view of all events, allowing users to explore event specifics, including descriptions, schedules, and related information.
- **Update Events:** Empowering users to modify event details dynamically, ensuring that event information remains accurate and up-to-date.
- **Delete Events:** A straightforward process for removing events from the system, giving organisers the ability to manage and curate the platform effectively.

* **Related Events:** Connects events that are related and displaying on the event details page, making it more engaging for users
    
* **Organised Events:** Efficient organisation of events, ensuring a structured and user-friendly display for the audience, i.e., showing events created by the user on the user profile
    
* **Search & Filter:** Encouraging users with a robust search and filter system, enabling them to easily find the events that match their preferences and seamlessly uses pagination to improve user experience.
    
* **New Category:** Dynamic categorisation allows for the seamless addition of new event categories, keeping your platform evolving.
    
* **Checkout with Stripe:** Smooth and secure payment transactions using Stripe, enhancing user experience during the checkout process.
    
* **Event Orders:** Comprehensive order management system, providing a clear overview of all event-related transactions.


## Running the Service 👩‍💻

### Clone the repository in your terminal and navigate to the project folder
```bash
git clone https://github.com/beckylakes/eventure.git
cd eventure
```
### Install project dependencies using npm:
```bash
npm install
```
**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SERVER_URL=

#CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#MONGODB
MONGODB_URI=

#UPLOADTHING
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

#STRIPE
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Replace the placeholder values with your actual credentials 

**Running the Project**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## To do list 📝
* More social features: see who is attending an event, becoming friends with people attending the same event, sharing events via socials (I realised early on in the project that these particularly pose security risks to users that, given the timeframe, I felt I could not effectively address so these have been left for now!)
* RBAC for protected routes (I am very actively working on this!)
* Confirmation emails upon signing up, and also upon attending an event

## Additional Information
For any questions or issues, please let me know [here](https://github.com/beckylakes/eventure/issues).
