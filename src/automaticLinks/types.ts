import { Ingredient } from "../data/ingredients";

export interface Result {
  text: string;
  from: number;
  to: number;
  id: string;
}

export interface SearchTerm extends Ingredient {}

export interface SearchOptions {
  searchTerms: SearchTerm[];
  results: Partial<Result>[];
  searchResultClass: string;
  caseSensitive: boolean;
  disableRegex: boolean;
  onClick?: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export interface TextNodesWithPosition {
  text: string;
  pos: number;
}
