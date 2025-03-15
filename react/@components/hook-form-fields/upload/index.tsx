"use client";

import { useFormContext, useWatch } from "react-hook-form";

import * as FileUpload from "./pure-upload";
import { FileUploadRootProps } from "@ark-ui/react/file-upload";
import { Button } from "@/components/button";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { Avatar } from "@/components/avatar";
import { ReactElement, useEffect, useMemo } from "react";
import { Text } from "@/components/text";
import { SystemStyleObject } from "styled-system/types";
import { css } from "styled-system/css";
import { Flex } from "styled-system/jsx";
import { Form } from "../styled";

type Props = FileUploadRootProps & {
  name: string;
  label?: string;
  description?: string;
  fallbackLabel?: string;
  css?: SystemStyleObject;
  removable?: boolean;
  onFileUpload?: (file: File) => void;
  onFileDelete?: (file: File) => void;
  placeholder?: string;
  uploadedFilesName?: string;
  fileItems?: (file: File, id: number) => ReactElement;
};

const imageExt = ["jpg", "jpeg", "png", "gif", "svg", "webp"];

const Fallback = ({
  name,
  fallbackLabel,
  removable,
}: {
  name: string;
  fallbackLabel?: string;
  removable?: boolean;
}) => {
  const { control } = useFormContext();

  const current = useWatch({
    control: control,
    name,
  });

  const fallbackFiles = useMemo(() => {
    const urls = Array.isArray(current)
      ? current.filter((item) => typeof item === "string")
      : [];

    if (urls.length === 0) return [];

    const files = urls.map((url) => {
      const fullUrl = `/api/files/${url}`;

      const isImage = imageExt.some((ext) => fullUrl.endsWith(ext));

      const file = new File([fullUrl], current, { type: "image/*" });
      return {
        file,
        isImage,
        url: fullUrl,
      };
    });

    return files;
  }, [current]);

  if (fallbackFiles.length === 0) return null;

  return fallbackFiles.map((fallbackFile, index) => (
    <FileUpload.Item
      key={fallbackFile.url}
      file={fallbackFile.file}
      alignItems="center"
      display="flex"
      justifyContent="flex-start"
    >
      {fallbackFile.isImage && <Avatar src={fallbackFile.url} rounded="md" />}
      {!fallbackFile.isImage && (
        <FileUpload.VisualizeIframe url={fallbackFile.url} />
      )}
      <a href={fallbackFile.url} target="_blank" rel="noreferrer">
        <Text as="strong" display="flex" alignItems="center" color="primary.4">
          {fallbackLabel ?? "Avatar atual"}{" "}
          {fallbackFiles.length > 1 && `(${index + 1})`}
        </Text>
      </a>
      {removable && (
        <FileUpload.ItemDeleteTrigger asChild>
          <Button variant="link" size="sm" ml="auto">
            <Trash size={22} />
          </Button>
        </FileUpload.ItemDeleteTrigger>
      )}
    </FileUpload.Item>
  ));
};

const Checker = ({
  name,
  clearFiles,
}: {
  name: string;
  clearFiles: () => void;
}) => {
  const { control } = useFormContext();

  const current = useWatch({
    control: control,
    name,
  });

  useEffect(() => {
    if (!current) {
      clearFiles();
    }
  }, [clearFiles, current]);

  return null;
};

export const InputUpload = ({
  name,
  label,
  description,
  css: cssProps,
  fallbackLabel,
  removable,
  onFileUpload,
  onFileDelete,
  placeholder = "Arraste e solte aqui ou",
  uploadedFilesName,
  fileItems,
  ...rest
}: Props) => {
  const form = useFormContext();

  return (
    <Form.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Form.FormItem>
          <Form.FormLabel>{label}</Form.FormLabel>
          <Form.FormControl>
            <FileUpload.Root
              maxFiles={3}
              {...rest}
              onFileAccept={(file) => {
                field.onChange(file.files);
                onFileUpload?.(file.files[0]);
              }}
              className={css(cssProps)}
            >
              <FileUpload.Dropzone>
                <FileUpload.Label>{placeholder}</FileUpload.Label>
                <FileUpload.Trigger asChild>
                  <Button size="sm" variant="link">
                    Clique para buscar
                  </Button>
                </FileUpload.Trigger>
              </FileUpload.Dropzone>
              <Flex
                id="_input-upload-items"
                flexDir="column"
                maxH="200px"
                overflowY="auto"
                gap={4}
                paddingInline={2}
                position="relative"
              >
                <FileUpload.ItemGroup>
                  <FileUpload.Context>
                    {({ acceptedFiles, clearFiles }) => (
                      <>
                        <Checker name={name} clearFiles={clearFiles} />
                        {acceptedFiles.map((file, id) => {
                          if (fileItems)
                            return <span key={id}>{fileItems(file, id)}</span>;

                          return (
                            <FileUpload.Item key={id} file={file}>
                              {file.type === "application/pdf" && (
                                <FileUpload.VisualizeIframe
                                  url={URL.createObjectURL(file)}
                                />
                              )}
                              <FileUpload.ItemPreview type="image/*">
                                <FileUpload.ItemPreviewImage />
                              </FileUpload.ItemPreview>
                              <FileUpload.ItemName />
                              <FileUpload.ItemSizeText />
                              <FileUpload.ItemDeleteTrigger asChild>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => onFileDelete?.(file)}
                                >
                                  <Trash size={22} />
                                </Button>
                              </FileUpload.ItemDeleteTrigger>
                            </FileUpload.Item>
                          );
                        })}
                      </>
                    )}
                  </FileUpload.Context>
                </FileUpload.ItemGroup>
                {!!uploadedFilesName && (
                  <Fallback
                    name={uploadedFilesName}
                    fallbackLabel={fallbackLabel}
                    removable={removable}
                  />
                )}
              </Flex>
              <FileUpload.HiddenInput />
            </FileUpload.Root>
          </Form.FormControl>
          <Form.FormDescription>{description}</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  );
};
