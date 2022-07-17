import { SearchTerm } from "./types";

function createRegExpFromText(text: string) {
  const reg = RegExp(`\\b${text}\\b`, "gui");

  // `\\b${text}\\b` checks for word boundaries around text
  return reg;
}

export const applyRegexToSearchResults = (s: SearchTerm[]): RegExp => {
  let searchTerms: string[] = [];

  s.forEach(({ name }) => {
    searchTerms.push(name);
  });

  searchTerms = [...new Set(searchTerms)];

  const concatedSearchTerms = searchTerms.join("|");

  const largeRegex = createRegExpFromText(String.raw`${concatedSearchTerms}`);
  // console.log("LARGEREGEX", largeRegex);
  return largeRegex;
};
