import {
  BaseBoxShapeUtil,
  Geometry2d,
  HTMLContainer,
  Rectangle2d,
  RecordProps,
  T,
  TLBaseShape,
  resizeBox,
  TLResizeInfo,
  JsonObject,
  TLShapeId,
  createShapeId,
  stopEventPropagation,
} from "tldraw";

type IPageShape = TLBaseShape<
  "my-page-shape",
  {
    w: number;
    h: number;
    id: string;
    relations: string[];
    disabled: boolean;
  }
>;
export class PageShapeUtil extends BaseBoxShapeUtil<IPageShape> {
  static override type = "my-page-shape" as const;
  static override props: RecordProps<IPageShape> = {
    w: T.number,
    h: T.number,
    id: T.string,
    relations: T.arrayOf(T.string),
    disabled: T.boolean,
  };

  getDefaultProps(): IPageShape["props"] {
    return {
      w: 200,
      h: 100,
      id: "",
      relations: [],
      disabled: false,
    };
  }

  // https://tldraw.dev/examples/shapes/tools/custom-shape
  override canEdit() {
    return false;
  }
  override canResize() {
    return true;
  }
  override isAspectRatioLocked() {
    return false;
  }

  getGeometry(shape: IPageShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,

      isFilled: true,
    });
  }

  override onResize(shape: any, info: TLResizeInfo<any>) {
    return resizeBox(shape, info);
  }

  onDoubleClick(shape: IPageShape) {
    console.log("clikecd", shape);
    const bindings = this.editor.getBindingsInvolvingShape(shape, "arrow");
    if (bindings.length > 0) {
      console.log("shape has bindings already");
      console.log(bindings);
<<<<<<< HEAD
      const arrowsToRemove = bindings.map(({ fromId }) => fromId);
      this.editor.deleteShapes(arrowsToRemove);

      // TODO: remove bindings and arrow
      // get arrow and remove it

      this.editor.deleteBindings(bindings);
=======

      // TODO: remove bindings and arrow
>>>>>>> f3e827c719a2cdf286feb180da33b1ab33f2dbf2
      return;
    }

    const idsToSelect = shape.props.relations.map((id) => createShapeId(id));
    if (idsToSelect.length === 0) return;

    idsToSelect.forEach((id) => {
      const selectedShape = this.editor.getShape(id);
      if (!selectedShape) return;

      console.log("related shape", selectedShape);
      const arrowShapeId = createShapeId();
      this.editor.createShape({
        id: arrowShapeId,
        type: "arrow",
        //   x: shape.x,
        //   y: shape.y,
        props: {
          start: { x: shape.x, y: shape.y },
          end: { x: selectedShape.x, y: selectedShape.y },
        },
      });
      this.editor.createBindings([
        {
          fromId: arrowShapeId,
          toId: shape.id,
          type: "arrow",
          props: { terminal: "start", isPrecise: false, isExact: false },
        },
        {
          fromId: arrowShapeId,
          toId: selectedShape.id,
          type: "arrow",
          props: { terminal: "end", isPrecise: true, isExact: false },
        },
      ]);

      // When creating an arrow, we must create bindings on each arrow part (start and end)
      // this.editor.createBinding({
      //   fromId: shape.id,
      //   toId: id,
      //   type: "arrow",
      //   props: {
      //     isExact: false,
      //     isPrecise: true,
      //     terminal: "end",
      //   },
      //   meta: {},
      // });
    });

    // shape.props.relations.forEach((relationId) => {
    //   this.editor.createShape({ type: "" });
    // });
  }
  component(shape: IPageShape) {
    return (
      <HTMLContainer style={{ backgroundColor: "#efefef" }}>
        {shape.props.id}
      </HTMLContainer>
    );
  }

  indicator(shape: IPageShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
