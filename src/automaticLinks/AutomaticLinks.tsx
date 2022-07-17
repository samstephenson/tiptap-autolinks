import { Extension } from "@tiptap/core";
import { DecorationSet, EditorView } from "prosemirror-view";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { Ingredient } from "../data/ingredients";
import { SearchTerm, SearchOptions } from "./types";

import { debouncedProcessSearches } from "./processSearches";

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

let editorView: EditorView;
let decorationSet: DecorationSet;

const updateView = (state: EditorState, dispatch: any) => dispatch(state.tr);

// eslint-disable-next-line @typescript-eslint/ban-types
export const AutomaticLinks = Extension.create<SearchOptions>({
  name: "search",

  addOptions() {
    return {
      searchTerms: [{ name: "hello", id: "001" }],
      onClick: () => console.log("click"),
      isLoading: true,
      setIsLoading: (newState: boolean) => console.log(newState),
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
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
        state: {
          init: (_, state) => {
            decorationSet = DecorationSet.create(state.doc, []);
            return decorationSet;
          },
          apply({ doc, docChanged }) {
            const { searchTerms, searchResultClass, setIsLoading } =
              extensionThis.options;

            // Make this async
            if (docChanged || searchTerms) {
              setIsLoading(true);
              let t0 = performance.now();
              const searchResults = debouncedProcessSearches(
                doc,
                searchTerms,
                searchResultClass
              );
              let t1 = performance.now();
              console.log(
                `CHECKING ${searchTerms.length} SEARCH TERMS. Time Taken:`,
                Math.round(t1 - t0)
              );
              setIsLoading(false);
              return searchResults.decorationsToReturn;
            }
            setIsLoading(false);
            return DecorationSet.empty;
          },
        },
        view: () => ({
          update: view => {
            editorView = view;
            // setTimeout(addEventListenersToDecorations, 100);
          },
        }),
      }),
      clickHandler(this.options.onClick),
    ];
  },
});
