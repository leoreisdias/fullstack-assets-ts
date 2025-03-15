import StateManagedSelect, { StylesConfig } from "react-select";
import Select from "react-select";

export const SelectCalendar: StateManagedSelect = (props) => {
  const customStyles: StylesConfig<any, any, any> = {
    control: () => ({
      display: "flex",
      cursor: "pointer",
      justifyContent: "center",
    }),
    container: (props) => ({
      ...props,
      width: "100px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    valueContainer: () => ({
      display: "flex",
      alignItems: "center",
      maxWidth: "75px",
    }),
  };

  return <Select {...props} isSearchable={false} styles={customStyles} />;
};
