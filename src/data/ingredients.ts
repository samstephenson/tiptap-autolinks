import { testData } from "./testData";
import { v4 as uuidv4 } from "uuid";

export interface Ingredient {
  name: string;
  id: string;
}

let ingredientStrings: string[] = [];
testData.map(item => {
  ingredientStrings.push(...item.ingredients);
  return null;
});
ingredientStrings = [...new Set(ingredientStrings)];
// Change length filter to make search function heavier
ingredientStrings = ingredientStrings.filter(x => x.length < 10);
// console.log(ingredientStrings);

export const ingredients: Ingredient[] = ingredientStrings.map(x => ({
  name: x,
  id: uuidv4(),
}));
