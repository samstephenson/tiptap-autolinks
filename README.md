# Tiptap automatic links demo

Example of using [Tiptap](https://tiptap.dev/) decorations to highlight any text in an editor that mathes one of _n_ search terms.

Implementation is based heavily on [serenadeinserenade](https://github.com/sereneinserenade)'s [find & replace plugin](https://github.com/sereneinserenade/tiptap-search-n-replace-demo).

The example here uses a dataset of ~5,000 food ingredients, and creates a link in the editor whenever an ingredient is mentioned.

## Setup demo

The demo is based on create-react-app, so clone the repository them use the following to get it running

```
npm install
npm start
```

## Use it yourself

To use in your own project, copyPaste the `AutomaticLinks.tsx` file into your project. Then in your Tiptap editor, import the plugin:

```JS
import { AutomaticLinks } from "./AutomaticLinks";
```

then add `AutomaticLinks` to your extensions list for the tiptap editor, along with configuration info.

```JS
AutomaticLinks.configure({
    searchResultClass: "autolink",
    searchTerms: arrayOfSearchTerms,
    onClick: id => {
        functionToRunOnLinkClick(id);
    },
}),
```
