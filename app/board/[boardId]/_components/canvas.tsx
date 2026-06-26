"use client";

import { nanoid } from "nanoid";
import { useCallback, useMemo, useState, useEffect } from "react";
import { LiveObject } from "@liveblocks/client";
import { Plus, Minus } from "lucide-react";

import { 
  useHistory, 
  useCanUndo, 
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@/liveblocks.config";
import { 
  colorToCss,
  connectionIdToColor, 
  findIntersectingLayersWithRectangle, 
  penPointsToPathLayer, 
  pointerEventToCanvasPoint, 
  resizeBounds,
  cn,
} from "@/lib/utils";
import { 
  Camera, 
  CanvasMode, 
  CanvasState, 
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Button } from "@/components/ui/button";

import { Info } from "./info";
import { Path } from "./path";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { CursorsPresence } from "./cursors-presence";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
};

export const Canvas = ({
  boardId,
}: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const boardBgColor = useStorage((root) => root.boardBgColor) || "#ffffff";

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  // Mobile pinch-to-zoom / pan touch states
  const [touchStartDist, setTouchStartDist] = useState<number>(0);
  const [touchStartZoom, setTouchStartZoom] = useState<number>(1);
  const [touchStartMid, setTouchStartMid] = useState<Point>({ x: 0, y: 0 });
  const [touchStartCamera, setTouchStartCamera] = useState<Camera>({ x: 0, y: 0 });

  useDisableScrollBounce();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const changeBgColor = useMutation(({ storage }, color: string) => {
    storage.set("boardBgColor", color);
  }, []);

  const eraseLayersAtPoint = useMutation((
    { storage, setMyPresence },
    point: Point
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    for (let i = layerIds.length - 1; i >= 0; i--) {
      const id = layerIds[i];
      const layer = liveLayers.get(id);
      if (layer) {
        const lx = layer.get("x");
        const ly = layer.get("y");
        const lw = layer.get("width");
        const lh = layer.get("height");

        const tolerance = 15;
        const xMin = Math.min(lx, lx + lw) - tolerance;
        const xMax = Math.max(lx, lx + lw) + tolerance;
        const yMin = Math.min(ly, ly + lh) - tolerance;
        const yMax = Math.max(ly, ly + lh) + tolerance;

        if (point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax) {
          liveLayers.delete(id);
          const index = liveLayerIds.indexOf(id);
          if (index !== -1) {
            liveLayerIds.delete(index);
          }
        }
      }
    }

    setMyPresence({ selection: [] }, { addToHistory: true });
  }, [layerIds]);

  const cancelDraft = useMutation(({ setMyPresence }) => {
    setMyPresence({ pencilDraft: null });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2.0));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.2));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1.0);
  }, []);

  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    position: Point,
  ) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUsedColor,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const translateSelectedLayers = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    };

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        });
      }
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, 
  [
    canvasState,
  ]);

  const unselectLayers = useMutation((
    { self, setMyPresence }
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const updateSelectionNet = useMutation((
    { storage, setMyPresence },
    current: Point,
    origin: Point,
  ) => {
    const layers = storage.get("layers").toImmutable();
    setCanvasState({
      mode: CanvasMode.SelectionNet,
      origin,
      current,
    });

    const ids = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current,
    );

    setMyPresence({ selection: ids });
  }, [layerIds]);

  const startMultiSelection = useCallback((
    current: Point,
    origin: Point,
  ) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5
    ) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const continueDrawing = useMutation((
    { self, setMyPresence },
    point: Point,
    e: React.PointerEvent,
  ) => {
    const { pencilDraft } = self.presence;

    if (
      canvasState.mode !== CanvasMode.Pencil ||
      e.buttons !== 1 ||
      pencilDraft == null
    ) {
      return;
    }

    setMyPresence({
      cursor: point,
      pencilDraft:
        pencilDraft.length === 1 &&
        pencilDraft[0][0] === point.x &&
        pencilDraft[0][1] === point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]],
    });
  }, [canvasState.mode]);

  const insertPath = useMutation((
    { storage, self, setMyPresence }
  ) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (
      pencilDraft == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        pencilDraft,
        lastUsedColor,
      )),
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, [lastUsedColor]);

  const startDrawing = useMutation((
    { setMyPresence },
    point: Point,
    pressure: number,
  ) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor,
    })
  }, [lastUsedColor]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point,
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) {
      layer.update(bounds);
    };
  }, [canvasState]);

  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH,
  ) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    });
  }, [history]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      const zoomFactor = 1.1;
      setZoom((zoom) => {
        const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
        return Math.max(0.2, Math.min(2.0, newZoom));
      });
    } else {
      setCamera((camera) => ({
        x: camera.x - e.deltaX,
        y: camera.y - e.deltaY,
      }));
    }
  }, []);

  const onPointerMove = useMutation((
    { setMyPresence }, 
    e: React.PointerEvent
  ) => {
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e, camera, zoom);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayers(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    } else if (canvasState.mode === CanvasMode.Eraser && e.buttons === 1) {
      eraseLayersAtPoint(current);
    }

    setMyPresence({ cursor: current });
  }, 
  [
    continueDrawing,
    camera,
    canvasState,
    resizeSelectedLayer,
    translateSelectedLayers,
    startMultiSelection,
    updateSelectionNet,
    zoom,
    eraseLayersAtPoint
  ]);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerDown = useCallback((
    e: React.PointerEvent,
  ) => {
    const point = pointerEventToCanvasPoint(e, camera, zoom);

    if (canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure);
      return;
    }

    if (canvasState.mode === CanvasMode.Eraser) {
      eraseLayersAtPoint(point);
      return;
    }

    setCanvasState({ origin: point, mode: CanvasMode.Pressing });
  }, [camera, canvasState.mode, setCanvasState, startDrawing, zoom, eraseLayersAtPoint]);

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera, zoom);

    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      unselectLayers();
      setCanvasState({
        mode: CanvasMode.None,
      });
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath();
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else if (canvasState.mode === CanvasMode.Eraser) {
      // Keep eraser tool active
    } else {
      setCanvasState({
        mode: CanvasMode.None,
      });
    }

    history.resume();
  }, 
  [
    setCanvasState,
    camera,
    canvasState,
    history,
    insertLayer,
    unselectLayers,
    insertPath,
    zoom
  ]);

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string,
  ) => {
    if (
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting ||
      canvasState.mode === CanvasMode.Eraser
    ) {
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera, zoom);

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, 
  [
    setCanvasState,
    camera,
    history,
    canvasState.mode,
    zoom
  ]);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        // case "Backspace":
        //   deleteLayers();
        //   break;
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [deleteLayers, history]);

  // Touch gesture callbacks for mobile pinch zoom + two-finger panning
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      cancelDraft();
      
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      setTouchStartDist(dist);
      setTouchStartZoom(zoom);

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      setTouchStartMid({ x: midX, y: midY });
      setTouchStartCamera(camera);
    }
  }, [zoom, camera, cancelDraft]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / touchStartDist;
      setZoom(Math.max(0.2, Math.min(2.0, touchStartZoom * factor)));

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      const deltaX = midX - touchStartMid.x;
      const deltaY = midY - touchStartMid.y;
      
      setCamera({
        x: touchStartCamera.x + deltaX,
        y: touchStartCamera.y + deltaY,
      });
    }
  }, [touchStartDist, touchStartZoom, touchStartMid, touchStartCamera]);

  const onTouchEnd = useCallback(() => {
    setTouchStartDist(0);
  }, []);

  return (
    <main
      className="h-full w-full relative touch-none transition-colors duration-300"
      style={{ backgroundColor: boardBgColor }}
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>

      {/* Settings and Zoom Widgets */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-y-2 items-end z-50">
        {/* Background Color Picker Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-200/50 flex gap-x-2 items-center">
          <span className="text-xs font-semibold text-slate-500 mr-1 select-none">Canvas:</span>
          {[
            { name: "White", value: "#ffffff" },
            { name: "Slate", value: "#f8fafc" },
            { name: "Cream", value: "#fdfbf7" },
            { name: "Ice", value: "#f0f9ff" },
            { name: "Sage", value: "#f0fdf4" },
            { name: "Charcoal", value: "#1e293b" },
          ].map((bg) => (
            <button
              key={bg.value}
              onClick={() => changeBgColor(bg.value)}
              className={cn(
                "w-6 h-6 rounded-full border border-slate-300/60 shadow-sm transition hover:scale-110 active:scale-95",
                boardBgColor === bg.value && "ring-2 ring-indigo-500 ring-offset-1"
              )}
              style={{ backgroundColor: bg.value }}
              title={bg.name}
            />
          ))}
        </div>

        {/* Zoom Controls Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-200/50 flex items-center gap-x-1.5">
          <Button
            size="icon"
            variant="board"
            className="h-8 w-8 hover:bg-slate-100/50"
            onClick={zoomOut}
            disabled={zoom <= 0.2}
            title="Zoom Out"
          >
            <Minus className="h-4 w-4 text-slate-700" />
          </Button>
          <Button
            variant="board"
            className="h-8 px-2 font-semibold text-xs text-slate-700 select-none hover:bg-slate-100/50"
            onClick={resetZoom}
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            size="icon"
            variant="board"
            className="h-8 w-8 hover:bg-slate-100/50"
            onClick={zoomIn}
            disabled={zoom >= 2.0}
            title="Zoom In"
          >
            <Plus className="h-4 w-4 text-slate-700" />
          </Button>
        </div>
      </div>
    </main>
  );
};
