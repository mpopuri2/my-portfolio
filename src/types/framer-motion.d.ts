/**
 * Ambient type stub for framer-motion.
 * The installed package's dist/index.d.ts is missing (partial install).
 * Covers every API used in this project.
 */
declare module "framer-motion" {
  import type * as React from "react";

  // ─── MotionValue ────────────────────────────────────────────────────────────
  export interface MotionValue<T = number> {
    get(): T;
    set(v: T): void;
    getVelocity(): number;
    on(
      event: "change" | "renderRequest" | "animationStart" | "animationComplete",
      callback: (v: T) => void
    ): () => void;
    destroy(): void;
  }

  // ─── Transition / Spring ────────────────────────────────────────────────────
  export interface SpringTransition {
    type: "spring";
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
    restDelta?: number;
    restSpeed?: number;
    delay?: number;
    duration?: number;
  }

  export interface TweenTransition {
    type?: "tween";
    duration?: number;
    ease?: string | number[] | ((t: number) => number);
    delay?: number;
    repeat?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    repeatDelay?: number;
  }

  export type Transition = (SpringTransition | TweenTransition) & {
    [key: string]: unknown;
  };

  // ─── Variant / Animate definitions ──────────────────────────────────────────
  export type TargetAndTransition = {
    opacity?: number | number[];
    x?: number | string | Array<number | string>;
    y?: number | string | Array<number | string>;
    z?: number | number[];
    scale?: number | number[];
    scaleX?: number | number[];
    scaleY?: number | number[];
    rotate?: number | number[];
    rotateX?: number | number[];
    rotateY?: number | number[];
    rotateZ?: number | number[];
    skewX?: number | number[];
    skewY?: number | number[];
    originX?: number | string;
    originY?: number | string;
    transition?: Transition;
    transitionEnd?: Record<string, unknown>;
    [key: string]: unknown;
  };

  export type VariantLabels = string | string[];
  export type Variant =
    | TargetAndTransition
    | ((custom: any) => TargetAndTransition);
  export type Variants = Record<string, Variant>;

  // ─── Motion style (allows MotionValues - does NOT extend React.CSSProperties
  //     because React's branded Opacity/Scale types conflict with MotionValue)
  export interface MotionStyle {
    x?: MotionValue<number> | MotionValue<string> | number | string;
    y?: MotionValue<number> | MotionValue<string> | number | string;
    z?: MotionValue<number> | number;
    scale?: MotionValue<number> | number | string;
    scaleX?: MotionValue<number> | number | string;
    scaleY?: MotionValue<number> | number | string;
    rotate?: MotionValue<number> | number | string;
    rotateX?: MotionValue<number> | number | string;
    rotateY?: MotionValue<number> | number | string;
    rotateZ?: MotionValue<number> | number | string;
    opacity?: MotionValue<number> | number | string;
    skewX?: MotionValue<number> | number | string;
    skewY?: MotionValue<number> | number | string;
    // Common CSS properties
    width?: string | number | MotionValue<string> | MotionValue<number>;
    height?: string | number | MotionValue<string> | MotionValue<number>;
    maxWidth?: string | number;
    maxHeight?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    margin?: string | number;
    padding?: string | number;
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
    borderRadius?: string | number | MotionValue<number>;
    background?: string;
    backgroundColor?: string;
    color?: string;
    display?: string;
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
    overflow?: string;
    flexDirection?: string;
    alignItems?: string;
    justifyContent?: string;
    gap?: string | number;
    zIndex?: number | string;
    transformOrigin?: string;
    filter?: string | MotionValue<string>;
    backdropFilter?: string;
    boxShadow?: string | MotionValue<string>;
    border?: string;
    borderColor?: string;
    cursor?: string;
    pointerEvents?: string;
    willChange?: string;
    [key: string]: unknown;
  }

  // ─── Viewport ────────────────────────────────────────────────────────────────
  export interface ViewportOptions {
    root?: React.RefObject<Element>;
    once?: boolean;
    margin?: string;
    amount?: number | "some" | "all";
  }

  // ─── Core MotionProps ────────────────────────────────────────────────────────
  export interface MotionProps {
    initial?: VariantLabels | TargetAndTransition | boolean;
    animate?: VariantLabels | TargetAndTransition;
    exit?: VariantLabels | TargetAndTransition;
    whileHover?: VariantLabels | TargetAndTransition;
    whileTap?: VariantLabels | TargetAndTransition;
    whileFocus?: VariantLabels | TargetAndTransition;
    whileDrag?: VariantLabels | TargetAndTransition;
    whileInView?: VariantLabels | TargetAndTransition;
    viewport?: ViewportOptions;
    variants?: Variants;
    transition?: Transition;
    custom?: unknown;
    style?: MotionStyle;
    layout?: boolean | "position" | "size";
    layoutId?: string;
    onAnimationStart?: (definition: VariantLabels | TargetAndTransition) => void;
    onAnimationComplete?: (definition: VariantLabels | TargetAndTransition) => void;
    onHoverStart?: (event: MouseEvent, info: { point: { x: number; y: number } }) => void;
    onHoverEnd?: (event: MouseEvent, info: { point: { x: number; y: number } }) => void;
    drag?: boolean | "x" | "y";
    dragConstraints?:
      | React.RefObject<Element>
      | { top?: number; right?: number; bottom?: number; left?: number };
    dragElastic?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number };
    dragMomentum?: boolean;
    [key: string]: unknown;
  }

  // ─── MotionComponent helper ───────────────────────────────────────────────────
  type MotionComponent<_T extends keyof JSX.IntrinsicElements> =
    React.ForwardRefExoticComponent<
      MotionProps & {
        className?: string;
        id?: string;
        style?: MotionStyle;
        children?: React.ReactNode;
        ref?: React.Ref<unknown>;
        href?: string;
        target?: string;
        rel?: string;
        type?: string;
        onClick?: React.MouseEventHandler<any>;
        onMouseEnter?: React.MouseEventHandler<any>;
        onMouseLeave?: React.MouseEventHandler<any>;
        onPointerEnter?: React.PointerEventHandler<any>;
        onPointerLeave?: React.PointerEventHandler<any>;
        role?: string;
        "aria-label"?: string;
        "aria-hidden"?: boolean | "true" | "false";
        tabIndex?: number;
        [key: string]: unknown;
      }
    >;

  // ─── motion factory (explicit elements, no mapped type) ───────────────────────
  export interface MotionElements {
    div: MotionComponent<"div">;
    span: MotionComponent<"span">;
    p: MotionComponent<"p">;
    h1: MotionComponent<"h1">;
    h2: MotionComponent<"h2">;
    h3: MotionComponent<"h3">;
    h4: MotionComponent<"h4">;
    h5: MotionComponent<"h5">;
    h6: MotionComponent<"h6">;
    a: MotionComponent<"a">;
    button: MotionComponent<"button">;
    section: MotionComponent<"section">;
    article: MotionComponent<"article">;
    header: MotionComponent<"header">;
    footer: MotionComponent<"footer">;
    nav: MotionComponent<"nav">;
    main: MotionComponent<"main">;
    aside: MotionComponent<"aside">;
    ul: MotionComponent<"ul">;
    ol: MotionComponent<"ol">;
    li: MotionComponent<"li">;
    form: MotionComponent<"form">;
    input: MotionComponent<"input">;
    label: MotionComponent<"label">;
    textarea: MotionComponent<"textarea">;
    img: MotionComponent<"img">;
    svg: MotionComponent<"svg">;
    path: MotionComponent<"path">;
    circle: MotionComponent<"circle">;
    rect: MotionComponent<"rect">;
    line: MotionComponent<"line">;
    polyline: MotionComponent<"polyline">;
    polygon: MotionComponent<"polygon">;
    g: MotionComponent<"g">;
    text: MotionComponent<"text">;
    defs: MotionComponent<"defs">;
    use: MotionComponent<"use">;
    clipPath: MotionComponent<"clipPath">;
    mask: MotionComponent<"mask">;
  }

  export declare const motion: MotionElements & {
    create<T extends React.ComponentType<React.ComponentProps<T>>>(
      component: T
    ): React.FC<React.ComponentProps<T> & MotionProps>;
    custom<T extends React.ComponentType<React.ComponentProps<T>>>(
      component: T
    ): React.FC<React.ComponentProps<T> & MotionProps>;
  };

  // ─── AnimatePresence ─────────────────────────────────────────────────────────
  export declare function AnimatePresence(props: {
    children?: React.ReactNode;
    mode?: "sync" | "popLayout" | "wait";
    initial?: boolean;
    onExitComplete?: () => void;
    presenceAffectsLayout?: boolean;
  }): React.ReactElement | null;

  // ─── Hooks ───────────────────────────────────────────────────────────────────
  export declare function useMotionValue<T>(initial: T): MotionValue<T>;

  export declare function useSpring(
    source: MotionValue<number> | number,
    config?: Omit<SpringTransition, "type">
  ): MotionValue<number>;

  export interface UseScrollOptions {
    target?: React.RefObject<Element | null>;
    container?: React.RefObject<Element | null>;
    offset?: [string, string];
    layoutEffect?: boolean;
    smooth?: number;
  }

  export interface ScrollMotionValues {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
  }

  export declare function useScroll(options?: UseScrollOptions): ScrollMotionValues;

  export declare function useTransform<I, O>(
    value: MotionValue<I>,
    inputRange: I[],
    outputRange: O[],
    options?: { clamp?: boolean; ease?: Array<(t: number) => number> }
  ): MotionValue<O>;

  export declare function useTransform<O>(
    transformer: () => O,
    deps?: MotionValue[]
  ): MotionValue<O>;

  export declare function useMotionTemplate(
    strings: TemplateStringsArray,
    ...values: Array<MotionValue | number | string>
  ): MotionValue<string>;

  export declare function useAnimation(): {
    start(
      definition: VariantLabels | TargetAndTransition,
      options?: Transition
    ): Promise<void>;
    stop(): void;
    set(definition: TargetAndTransition): void;
  };

  export declare function useInView(
    ref: React.RefObject<Element | null>,
    options?: ViewportOptions
  ): boolean;
}
