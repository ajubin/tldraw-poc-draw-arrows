import { useEffect } from "react";
import "./App.css";

import {
  Tldraw,
  createShapeId,
  getSnapshot,
  loadSnapshot,
  useEditor,
  useValue,
} from "tldraw";
import "tldraw/tldraw.css";
import { PageShapeUtil } from "./Page";

function PersistenceButton() {
  const editor = useEditor();

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 10,
      }}
    >
      <button
        style={{ borderColor: "bisque" }}
        onClick={() => {
          // editor.
          const { document, session } = getSnapshot(editor.store);
          console.log({ document, session });
          navigator.clipboard.writeText(JSON.stringify({ document, session }));
          console.log("copied");
        }}
      >
        Copy snapshot
      </button>
      <button
        style={{ borderColor: "bisque" }}
        onClick={async () => {
          const { document, session } = JSON.parse(
            await navigator.clipboard.readText()
          );
          loadSnapshot(editor.store, { document, session });
        }}
      >
        Paste snapshot
      </button>
    </div>
  );
}
function App() {
  // notes: il faudrait un shape custom et mettre un onclick dans la shape
  // examples ici: https://tldraw.dev/examples/ui/context-toolbar

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        shapeUtils={[PageShapeUtil]}
        // Uncomment for persistence
        // persistenceKey="session-key"
        onMount={(editor) => {
          const nodes = [
            { id: "blog/test-1", x: 0, y: 0, relations: ["blog/2", "blog/3"] },
            { id: "blog/2", x: 0, y: 150 },
            { id: "blog/3", x: 0, y: 300 },
          ];

          nodes.forEach((node) => {
            const shapeId = createShapeId(node.id);
            console.log("shapeId", shapeId);
            editor.createShape({
              id: shapeId,
              type: "my-page-shape",
              x: node.x,
              y: node.y,
              props: {
                id: node.id,
                relations: node.relations || [],
                disabled: false,
              },
            });
            // editor.createShape({
            //   type: "geo",
            //   x: node.x,
            //   y: node.y,
            //   meta: { id: node.id },
            //   props: {
            //     w: 200,
            //     h: 70,
            //     geo: "rectangle",
            //     color: "violet",
            //     labelColor: "black",
            //     // NOTES: on tldraw 3.10.1 , text is replaced by richText
            //     text: node.id,
            //     // onclick: (e) => {
            //     //   console.log("shape clicked", e);
            //     // },
            //   },
            // });
          });

          editor.zoomToFit();
          // editor.selectAll();

          // editor.zoomToSelection({
          //   // animation: { duration: 5000 },
          // });
        }}
        options={{ maxPages: 1 }}
        onUiEvent={(...args) => {
          console.log("onUiEvent", ...args);
        }}
      >
        <PersistenceButton />
      </Tldraw>
    </div>
  );
}

export default App;
