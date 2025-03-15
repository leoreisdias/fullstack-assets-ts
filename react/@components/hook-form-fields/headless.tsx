// SHADOW-PANDA VERSION EXAMPLE: https://shadow-panda.dev/docs/components/form
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { styled } from "styled-system/jsx";
import { css, cx } from "styled-system/css";
import {
  formLabel,
  formItem,
  formControl,
  formDescription,
  formMessage,
} from "styled-system/recipes";
import { Label } from "@/components/form/label";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const BaseFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

const BaseFormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={css({
            width: "full",
          })}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);
BaseFormItem.displayName = "FormItem";

const BaseFormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  if (!props.children) return null;

  return (
    <Label
      ref={ref}
      className={cx(error && css({ color: "destructive" }), className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
BaseFormLabel.displayName = "FormLabel";

const BaseFormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
BaseFormControl.displayName = "FormControl";

const BaseFormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  const { formDescriptionId } = useFormField();

  if (!props.children) return null;

  return <p ref={ref} id={formDescriptionId} {...props} />;
});
BaseFormDescription.displayName = "FormDescription";

const BaseFormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p ref={ref} id={formMessageId} {...props}>
      {body}
    </p>
  );
});
BaseFormMessage.displayName = "FormMessage";

export const FormField = BaseFormField;
export const FormLabel = styled(BaseFormLabel, formLabel);
export const FormItem = styled(BaseFormItem, formItem);
export const FormControl = styled(BaseFormControl, formControl);
export const FormDescription = styled(BaseFormDescription, formDescription);
export const FormMessage = styled(BaseFormMessage, formMessage);
