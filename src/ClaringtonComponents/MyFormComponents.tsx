import * as React from "react";
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';


export const MyComboBox = (fieldRenderProps) => {
    const { label, options, value, onChange } = fieldRenderProps;
    return <ComboBox
      label={label}
      options={options}
      onChange={(event, option) => {
        event.preventDefault();
        // ! This calls the fields onChange event which in turn passes the new selected value to the form state.
        onChange({ value: option.text });
      }}
    />;
  };