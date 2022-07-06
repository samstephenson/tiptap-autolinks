import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { Ingredient } from "./data/ingredients";

import { Node as ProsemirrorNode } from "prosemirror-model";

export function clickHandler(onClick): Plugin {
  return new Plugin({
    key: new PluginKey("handleClickLink"),
    props: {
      handleClick: (view, pos, event) => {
        const link = (event.target as HTMLElement)?.closest("a");

        if (link && link.id) {
          console.log("clicked link", link);
          onClick(link.id);

          return true;
        }

        return false;
      },
    },
  });
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    search: {
      /**
       * @description Set search term in extension.
       */
      setSearchTerms: (searchTerms: Ingredient[]) => ReturnType;
    };
  }
}

interface Result {
  text: string;
  from: number;
  to: number;
  id: string;
}

interface SearchTerm extends Ingredient {}

interface SearchOptions {
  searchTerms: SearchTerm[];
  results: Partial<Result>[];
  searchResultClass: string;
  caseSensitive: boolean;
  disableRegex: boolean;
  onClick?: (id: string) => void;
}

interface TextNodesWithPosition {
  text: string;
  pos: number;
}

const updateView = (state: EditorState, dispatch: any) => dispatch(state.tr);

function createRegExpFromText(text: string) {
  const reg = RegExp(`\\b${text}\\b`, "gui");

  // `\\b${text}\\b` checks for word boundaries around text

  return reg;
}

const applyRegexToSearchResults = (s: SearchTerm[]): RegExp => {
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
          // console.log("M", m);

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

// eslint-disable-next-line @typescript-eslint/ban-types
export const AutomaticLinks = Extension.create<SearchOptions>({
  name: "search",

  addOptions() {
    return {
      searchTerms: [{ name: "hello", id: "001" }],
      onClick: () => console.log("click"),

      results: [],
      searchResultClass: "search-result",
      caseSensitive: false,
      disableRegex: false,
    };
  },

  addCommands() {
    return {
      setSearchTerms:
        (searchTerms: SearchTerm[]) =>
        ({ state, dispatch }) => {
          this.options.searchTerms = searchTerms;
          this.options.results = [];

          updateView(state, dispatch);

          return false;
        },
    };
  },

  addProseMirrorPlugins() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extensionThis = this;

    return [
      new Plugin({
        key: new PluginKey("search"),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply({ doc, docChanged }) {
            const { searchTerms, searchResultClass } = extensionThis.options;

            // Make this async
            if (docChanged || searchTerms) {
              const searchResults = processSearches(
                doc,
                searchTerms,
                searchResultClass
              );

              return searchResults.decorationsToReturn;
            }
            return DecorationSet.empty;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
      clickHandler(this.options.onClick),
    ];
  },
});
