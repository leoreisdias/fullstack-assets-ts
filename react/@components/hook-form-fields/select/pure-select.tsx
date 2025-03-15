import { createStyleContext } from "@/providers/parkui";
import type { Assign } from "@ark-ui/react";
import { Select as ArkSelect } from "@ark-ui/react/select";
import { type SelectVariantProps, select } from "styled-system/recipes";
import type { JsxStyleProps } from "styled-system/types";
import { SelectOptions } from "./select/shared";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";

const { withProvider, withContext } = createStyleContext(select);

export interface RootProps
  extends Assign<JsxStyleProps, ArkSelect.RootProps<ArkSelect.CollectionItem>>,
    SelectVariantProps {}
export const Root = withProvider<HTMLDivElement, RootProps>(
  ArkSelect.Root,
  "root"
);

export const ClearTrigger = withContext<
  HTMLButtonElement,
  Assign<JsxStyleProps, ArkSelect.ClearTriggerProps>
>(ArkSelect.ClearTrigger, "clearTrigger");

export const Content = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ContentProps>
>(ArkSelect.Content, "content");

export const Control = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ControlProps>
>(ArkSelect.Control, "control");

export const Indicator = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.IndicatorProps>
>(ArkSelect.Indicator, "indicator");

export const ItemGroupLabel = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ItemGroupLabelProps>
>(ArkSelect.ItemGroupLabel, "itemGroupLabel");

export const ItemGroup = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ItemGroupProps>
>(ArkSelect.ItemGroup, "itemGroup");

export const ItemIndicator = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ItemIndicatorProps>
>(ArkSelect.ItemIndicator, "itemIndicator");

export const Item = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ItemProps>
>(ArkSelect.Item, "item");

export const ItemText = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.ItemTextProps>
>(ArkSelect.ItemText, "itemText");

export const Label = withContext<
  HTMLLabelElement,
  Assign<JsxStyleProps, ArkSelect.LabelProps>
>(ArkSelect.Label, "label");

export const Positioner = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, ArkSelect.PositionerProps>
>(ArkSelect.Positioner, "positioner");

export const Trigger = withContext<
  HTMLButtonElement,
  Assign<JsxStyleProps, ArkSelect.TriggerProps>
>(ArkSelect.Trigger, "trigger");

export const ValueText = withContext<
  HTMLSpanElement,
  Assign<JsxStyleProps, ArkSelect.ValueTextProps>
>(ArkSelect.ValueText, "valueText");

export {
  SelectContext as Context,
  SelectHiddenSelect as HiddenSelect,
  type SelectContextProps as ContextProps,
  type SelectHiddenSelectProps as HiddenSelectProps,
} from "@ark-ui/react/select";

export const Select = (props: RootProps) => {
  const options = props.items as SelectOptions[];

  return (
    <Root
      positioning={{ sameWidth: true }}
      width="2xs"
      {...props}
      items={options}
    >
      <Control>
        <Trigger>
          <ValueText placeholder="" />
          <CaretDown />
        </Trigger>
      </Control>
      <Positioner>
        <Content>
          <ItemGroup>
            <ItemGroupLabel></ItemGroupLabel>
            {options.map((item) => (
              <Item key={item.value?.toString()} item={item}>
                <ItemText>{item.label}</ItemText>
                <ItemIndicator>
                  <Check />
                </ItemIndicator>
              </Item>
            ))}
          </ItemGroup>
        </Content>
      </Positioner>
    </Root>
  );
};
