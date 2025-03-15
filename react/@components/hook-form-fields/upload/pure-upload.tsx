// NOTE: USING ARK-UI
import { Dialog, useModal } from "@/components/modal";
import { createStyleContext } from "@/providers/parkui";
import type { Assign } from "@ark-ui/react";
import { FileUpload } from "@ark-ui/react/file-upload";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import { Flex } from "styled-system/jsx";
import { type FileUploadVariantProps, fileUpload } from "styled-system/recipes";
import type { JsxStyleProps } from "styled-system/types";

const { withProvider, withContext } = createStyleContext(fileUpload);

export interface RootProps
  extends Assign<JsxStyleProps, FileUpload.RootProps>,
    FileUploadVariantProps {}
export const Root = withProvider<HTMLDivElement, RootProps>(
  FileUpload.Root,
  "root"
);

export const Dropzone = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, FileUpload.DropzoneProps>
>(FileUpload.Dropzone, "dropzone");

export const ItemDeleteTrigger = withContext<
  HTMLButtonElement,
  Assign<JsxStyleProps, FileUpload.ItemDeleteTriggerProps>
>(FileUpload.ItemDeleteTrigger, "itemDeleteTrigger");

export const ItemGroup = withContext<
  HTMLUListElement,
  Assign<JsxStyleProps, FileUpload.ItemGroupProps>
>(FileUpload.ItemGroup, "itemGroup");

export const ItemName = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, FileUpload.ItemNameProps>
>(FileUpload.ItemName, "itemName");

export const ItemPreviewImage = withContext<
  HTMLImageElement,
  Assign<JsxStyleProps, FileUpload.ItemPreviewImageProps>
>(FileUpload.ItemPreviewImage, "itemPreviewImage");

export const ItemPreview = withContext<
  HTMLImageElement,
  Assign<JsxStyleProps, FileUpload.ItemPreviewProps>
>(FileUpload.ItemPreview, "itemPreview");

export const Item = withContext<
  HTMLLIElement,
  Assign<JsxStyleProps, FileUpload.ItemProps>
>(FileUpload.Item, "item");

export const ItemSizeText = withContext<
  HTMLDivElement,
  Assign<JsxStyleProps, FileUpload.ItemSizeTextProps>
>(FileUpload.ItemSizeText, "itemSizeText");

export const Label = withContext<
  HTMLLabelElement,
  Assign<JsxStyleProps, FileUpload.LabelProps>
>(FileUpload.Label, "label");

export const Trigger = withContext<
  HTMLButtonElement,
  Assign<JsxStyleProps, FileUpload.TriggerProps>
>(FileUpload.Trigger, "trigger");

export const VisualizeIframe = ({ url }: { url: string }) => {
  const { ref, open } = useModal();

  return (
    <>
      <Eye size={22} cursor="pointer" weight="bold" onClick={open} />
      <Dialog ref={ref}>
        <Flex w="500px" h="500px" p={4}>
          <iframe src={url} width="100%" height="100%" />
        </Flex>
      </Dialog>
    </>
  );
};

export {
  FileUploadContext as Context,
  FileUploadHiddenInput as HiddenInput,
  type FileUploadContextProps as ContextProps,
  type FileUploadHiddenInputProps as HiddenInputProps,
} from "@ark-ui/react/file-upload";
