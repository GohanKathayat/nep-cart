// import { Inngest } from "inngest";
// import connectDB from "./db";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "quickcart-next" });

// // inngest function to  save user data to database

// export const syncUserCreation = inngest.createFunction(
//     {
//         id:`sync-user-from-clerk`
//     },
//     {
//         event:`clerk/user.created`
//     },
//     async({event}) => {
//         const{ id,first_name,last_name,email_addresses,image_url } = event.data
//         const userData = {
//             _id:id,
//             email:email_addresses[0].email_address,
//             name: first_name + " " + last_name,
//             image:image_url
//         }
//         await connectDB()
//         await User.create(userData)
//     }
// )

// //inngest function to update user data in database
// export const syncUserUpdation = inngest.createFunction(
//     {
//         id:`update-user-from-clerk`
//     },
//     {
//         event:`clerk/user.updated`
//     },
//     async({event}) => {
//         const{ id,first_name,last_name,email_addresses,image_url } = event.data
//         const userData = {
//             _id:id,
//             email:email_addresses[0].email_address,
//             name: first_name + " " + last_name,
//             image:image_url
//         }
//         await connectDB()
//         await User.findByIdAndUpdate(id, userData)
//     }
// )

// // Inngest function to delete user data from database
// export const syncUserDeletion = inngest.createFunction(
//     {
//         id:`delete-user-with-clerk`
//     },
//     {
//         event:`clerk/user.deleted`
//     },
//     async({event}) => {
//         const{ id } = event.data
//         await connectDB()
//         await User.findByIdAndDelete(id)
//     }
// )


import { Inngest } from "inngest";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Create Inngest client
export const inngest = new Inngest({ id: "quickcart-next" });

// 1️⃣ Sync user creation
export const syncUserCreation = inngest.createFunction(
  { id: `sync-user-from-clerk` },
  { event: `clerk/user.created` },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      await User.create({
        _id: id,
        name: first_name + " " + last_name,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        cartItem: {},
      });
      console.log("User created:", id);
    } catch (err) {
      console.error("Error in syncUserCreation:", err);
    }
  }
);

// 2️⃣ Sync user update
export const syncUserUpdation = inngest.createFunction(
  { id: `update-user-from-clerk` },
  { event: `clerk/user.updated` },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      await User.findByIdAndUpdate(id, {
        name: first_name + " " + last_name,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
      });
      console.log("User updated:", id);
    } catch (err) {
      console.error("Error in syncUserUpdation:", err);
    }
  }
);

// 3️⃣ Sync user deletion
export const syncUserDeletion = inngest.createFunction(
  { id: `delete-user-with-clerk` },
  { event: `clerk/user.deleted` },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      console.log("User deleted:", id);
    } catch (err) {
      console.error("Error in syncUserDeletion:", err);
    }
  }
);
