import { faker } from "@faker-js/faker";

// Import your enums
import {
  EstateCategory,
  EstateType,
  EstateCondition,
  EstateStatus,
  EstateAmenity,
  EstateRentPeriod,
} from "../lib/enums";

// Function to generate random estates
const generateRandomEstates = (count: number) => {
  const estates = [];

  for (let i = 0; i < count; i++) {
    const randomAmenities = faker.helpers.arrayElements(
      Object.values(EstateAmenity),
      //faker.number.int({ min: 1, max: 5 })
      faker.number.int({ min: 1, max: 5 })
    );
    const estate = {
      category: faker.helpers.arrayElement(Object.values(EstateCategory)),
      type: faker.helpers.arrayElement(Object.values(EstateType)),
      condition: faker.helpers.arrayElement(Object.values(EstateCondition)),
      status: faker.helpers.arrayElement(Object.values(EstateStatus)),
      title: faker.lorem.words(5),
      description: faker.lorem.sentences(3),
      //price: faker.number.int({ min: 50000, max: 5000000 }),
      price: faker.number.int({ min: 50000, max: 5000000 }),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.url()
      ),
      videoUrl: faker.internet.url(),
      floorPlanUrl: faker.internet.url(),
      totalFloors: faker.number.int({ min: 1, max: 20 }),
      floorNumber: faker.number.int({ min: 0, max: 20 }),
      bedrooms: faker.number.int({ min: 1, max: 5 }),
      bathrooms: faker.number.int({ min: 1, max: 4 }),
      area: faker.number.int({ min: 300, max: 5000 }), // in square feet
      yearBuilt: faker.number.int({ min: 1900, max: 2023 }),
      amenities: randomAmenities,
      priceNegotiable: faker.datatype.boolean(),
      rentPeriod: faker.helpers.arrayElement(Object.values(EstateRentPeriod)),
      views: faker.number.int({ min: 0, max: 1000 }),
      openToVisitors: faker.datatype.boolean(),
      location: {
        type: "Point",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
      },
    };

    estates.push(estate);
  }

  return estates;
};

// Generate 10 random estates
export const randomEstates = generateRandomEstates(10);
