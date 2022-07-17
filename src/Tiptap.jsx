import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { AutomaticLinks } from "./automaticLinks/AutomaticLinks";
import { ingredients } from "./data/ingredients";

export default function Tiptap({ setActiveIngredient }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState(ingredients);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `focus:outline-none prose`,
      },
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      AutomaticLinks.configure({
        searchResultClass: " cursor-pointer text-red-500 hover:text-red-600",
        searchTerms: searchTerms,
        onClick: id => {
          setActiveIngredient(id);
        },
        isLoading,
        setIsLoading,
      }),
    ],
    content: `<p>To make the glaze, whisk together the barbecue sauce and vinegar in a small bowl and set aside.
    To make the spice rub, mix all the ingredients together well and store in an airtight container until needed.</p><p>
    To make the pork, take the pork out of the fridge for a good hour or so to allow to come to room temperature. Preheat the oven to 140C/120C Fan/Gas 1. Rub the mustard all over the pork – make sure the pork is completely covered and the mustard is well rubbed in. Liberally dust the pork all over with the spice rub and gently rub in.</p><p>
    To make the roasted garlic, drizzle the garlic cloves with olive oil and wrap in kitchen foil. Bake in the oven for about 40 minutes until the garlic is completely soft. Remove and set aside for use in the blue cheese dressing later.</p><p>
    Lay a large piece of kitchen foil on a work surface. Spoon half of the glaze onto the foil and lay the pork on top, fat side up. Spoon over the rest of the glaze and wrap the foil around the pork, making sure the pork is completely sealed in. Place in a deep roasting tin and add a cup of water (or beer if you have it) to the tin. Roast in the oven for 3½–4½ hours or until the pork parcel is soft to touch.</p><p>
    Rip open the top of the pork parcel, being careful of the steam, and turn the oven up to 240C/220C Fan/Gas 9. Sprinkle another layer of the spice rub on the pork and place back in the oven for 20–30 minutes or until it has started to caramelise (check it after 10 minutes). Remove from the oven and leave to cool slightly for about 10–20 minutes with a tray on top or a cover to stop the pork drying out.</p><p>
    To make the pickled red onions, warm the vinegar and sugar together until the sugar has dissolved, then remove from the heat and add the red onion and set aside until ready to serve.</p><p>
    To make the asparagus slaw, place all of the ingredients in a bowl and mix well. Season with salt and pepper and leave to marinate for 10–15 minutes before serving.</p><p>
    To make the blue cheese dressing, place all of the ingredients in a bowl along with the roasting garlic cloves and mix together. Transfer to a food processor and blend until it is a smooth dressing. Set aside until ready to serve.</p><p>
    To serve, remove any bones from the pork and slice. Place onto a serving plate along with a mound of the pickled onions and asparagus slaw. Drizzle the dressing over the Baby Gem lettuce and serve.</p>`,
  });

  useEffect(() => {
    console.log("updateding search terms");
    setSearchTerms(ingredients);
  }, []);

  return (
    <div style={{ opacity: isLoading ? 0.6 : 1 }}>
      <EditorContent editor={editor} />
    </div>
  );
}
