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
ingredientStrings = ingredientStrings.filter(x => x.length < 13);

export const ingredients: Ingredient[] = ingredientStrings.map(x => ({
  name: x,
  id: uuidv4(),
}));
