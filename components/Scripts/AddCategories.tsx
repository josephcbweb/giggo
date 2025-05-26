import { connectMongoDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";

const categories = [
  "Catering",
  "Cleaning",
  "Delivery",
  "Event Help",
  "Housekeeping",
  "Laborer",
  "Retail Assistance",
  "Security",
  "Warehouse Work",
  "Event Setup/Teardown",
  "Moving Assistance",
  "Pet Sitting/Dog Walking",
  "Gardening/Lawn Care",
  "Grocery Delivery",
  "Food Stall Assistance",
  "Flyer Distribution",
  "Babysitting/Childcare",
  "Tutoring/Homework Help",
  "Photography for Events",
  "Warehouse/Inventory Help",
  "Dishwashing/Kitchen Help",
  "Handyman Tasks",
  "Host/Hostess Assistance",
  "Trash Removal/Cleanout Services",
  "Car Washing/Detailing",
];

async function populateCategories() {
  try {
    await connectMongoDB();
    const inserted = await Category.insertMany(
      categories.map((name) => ({ name }))
    );
    console.log(`Inserted ${inserted.length} categories`);
  } catch (error) {
    console.error("Error populating categories:", error);
  } finally {
    process.exit();
  }
}

import React from "react";
import { Button } from "../ui/button";

const AddCategories = () => {
  return <div></div>;
};

export default AddCategories;
