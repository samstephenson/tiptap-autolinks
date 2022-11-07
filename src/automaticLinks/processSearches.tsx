import { Decoration, DecorationSet } from "prosemirror-view";
import { Result, SearchTerm, TextNodesWithPosition } from "./types";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { applyRegexToSearchResults } from "./createRegExpFromText";
import debounce from "lodash/debounce";

export const debouncedProcessSearches = debounce(processSearches, 300);

function processSearches(
  doc: ProsemirrorNode,
  searchTerms: SearchTerm[],
  searchResultClass: string
): { decorationsToReturn: DecorationSet; results: Partial<Result>[] } {
  const regex = applyRegexToSearchResults(searchTerms);
  const decorations: Decoration[] = [];
  let textNodesWithPosition: TextNodesWithPosition[] = [];
  const results: Partial<Result>[] = [];

  if (!regex) return { decorationsToReturn: DecorationSet.empty, results: [] };

  let index = 0;
  doc?.descendants((node, pos) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + node.text,
          pos: textNodesWithPosition[index].pos,
        };
      } else {
        textNodesWithPosition[index] = {
          text: `${node.text}`,
          pos,
        };
      }
    } else {
      index += 1;
    }
  });

  textNodesWithPosition = textNodesWithPosition.filter(Boolean);
  let matches: any[] = [];

  // console.log("BIG REGEX", regex);
  function getMatches() {
    // Loop over text nodes
    for (let i = 0; i < textNodesWithPosition.length; i += 1) {
      const { text, pos } = textNodesWithPosition[i];

      function regexMatch() {
        for (const match of text.matchAll(regex)) {
          // console.log("FOUND MATCH", match);
          matches.push(match);
        }
        // let m: any;
        // while ((m = regex.exec(text)) !== null) {
        //   // This is necessary to avoid infinite loops with zero-width matches
        //   if (m.index === regex.lastIndex) {
        //     regex.lastIndex++;
        //   }
        //   // The result can be accessed through the `m`-variable.
        //   m.forEach((match: any) => {
        //     if (match !== undefined) {
        //       // console.log(`Found match, group ${groupIndex}: ${match}`);
        //       matches.push(m);
        //     }
        //   });
        // }
      }
      regexMatch();

      // console.log("matches", matches.length);
      // Loop over matches (often just one)
      function loopMatches() {
        for (let j = 0; j < matches.length; j += 1) {
          const m: any = matches[j];

          if (m.index !== undefined) {
            results.push({
              text: m[0],
              from: pos + m.index,
              to: pos + m.index + m[0].length,
            });
          }
        }
      }
      loopMatches();
    }
  }
  getMatches();
  // Loop through all text nodes
  function getDecorations() {
    for (let i = 0; i < results.length; i += 1) {
      const r = results[i];
      // TODO: Get searchTerm from match
      const searchTerm = searchTerms.find(x => x.name === r.text);

      if (searchTerm && r.from && r.to) {
        decorations.push(
          Decoration.inline(r.from, r.to, {
            id: searchTerm.id,
            class: searchResultClass,
            nodeName: "a",
          })
        );
      }
    }
  }
  getDecorations();
  // Loop results, create decorations
  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results,
  };
}
