import { createStyleContext } from "@/providers/parkui";
import type { Assign } from "@ark-ui/react";
import { ToggleGroup } from "@ark-ui/react/toggle-group";
import { type ToggleGroupVariantProps, toggleGroup } from "styled-system/recipes";
import type { JsxStyleProps } from "styled-system/types";

const { withProvider, withContext } = createStyleContext(toggleGroup);

export interface ToogleProps extends Assign<JsxStyleProps, ToggleGroup.RootProps>, ToggleGroupVariantProps {}
export const Root = withProvider<HTMLDivElement, ToogleProps>(ToggleGroup.Root, "root");

export const Item = withContext<HTMLButtonElement, Assign<JsxStyleProps, ToggleGroup.ItemProps>>(
  ToggleGroup.Item,
  "item",
);

export {
  ToggleGroupContext as Context,
  type ToggleGroupContextProps as ContextProps,
} from "@ark-ui/react/toggle-group";
