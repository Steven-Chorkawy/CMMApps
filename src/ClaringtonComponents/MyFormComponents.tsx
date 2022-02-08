import * as React from "react";
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { CalculateTermEndDate } from "../ClaringtonHelperMethods/MyHelperMethods";


export const MyComboBox = (fieldRenderProps) => {
  const {
    label,
    options,
    value,
    required,
    description,
    onChange,
    disabled,
    validationMessage,
    visited
  } = fieldRenderProps;


  return <div key={`${label}-${value}`}>
    <ComboBox
      label={label}
      options={options}
      onChange={(event, option) => {
        event.preventDefault();
        // ! This calls the fields onChange event which in turn passes the new selected value to the form state.
        onChange({ value: option.text });
      }}
      disabled={disabled}
      required={required}
      defaultSelectedKey={value}
      errorMessage={(visited && validationMessage) ? validationMessage : ""}
    />
    <span>{description}</span>
  </div>;
};

export const MyDatePicker = fieldRenderProps => {
  return <div>
    <DatePicker
      {...fieldRenderProps}
      onSelectDate={e => fieldRenderProps.onChange({ value: e })}
      isRequired={fieldRenderProps.required && fieldRenderProps.visited && fieldRenderProps.validationMessage}
    />
    {
      fieldRenderProps.visited && fieldRenderProps.validationMessage &&
      <div role="alert">
        <p className="ms-TextField-errorMessage errorMessage-259">
          <span data-automation-id="error-message">{fieldRenderProps.validationMessage}</span>
        </p>
      </div>
    }

  </div>;
};

/**
     * Fluent UI's MaskedTextField is appending one extra character so this component will manually handle the OnChange event. 
     * Any field that uses a MaskedTextField will need to include "onChange={e => formRenderProps.onChange(e.name, e.value)}".
     * @param fieldRenderProps Kendo UI Field Render Props from form.
     * @returns MaskedTextField element.
     */
export const MyMaskedInput = (fieldRenderProps) => {
  return <MaskedTextField
    {...fieldRenderProps}
    onChange={(event, newValue) => fieldRenderProps.onChange({ name: fieldRenderProps.name, value: { value: newValue } })}
  />;
};

export const PhoneInput = (fieldRenderProps) => <MyMaskedInput {...fieldRenderProps} mask="(999) 999-9999" />;

export const PostalCodeInput = (fieldRenderProps) => <MyMaskedInput {...fieldRenderProps} mask="a9a 9a9" />;
