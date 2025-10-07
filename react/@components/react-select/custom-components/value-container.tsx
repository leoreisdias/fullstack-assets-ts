import Select, {
  StylesConfig,
  components,
  ValueContainerProps
} from 'react-select';

interface SelectOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

// Custom ValueContainer component to handle the "+N" display
export const ValueContainerPlusNTags = ({
  children,
  ...props
}: ValueContainerProps<SelectOption, true>) => {
  const { getValue, hasValue } = props;
  const values = getValue();

  if (!hasValue || !Array.isArray(values)) {
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  }

  const maxDisplayedTags = 2;
  const displayedValues = values.slice(0, maxDisplayedTags);
  const remainingCount = values.length - maxDisplayedTags;

  return (
    <components.ValueContainer {...props}>
      <div className="flex flex-nowrap items-center gap-1 w-full overflow-hidden">
        {displayedValues.map((value, index) => (
          <div
            key={`${value.value}-${value.label}`}
            className="flex items-center bg-blue-50 border border-blue-300 rounded px-1.5 py-0.5 m-0.5 text-sm whitespace-nowrap flex-shrink-0 max-w-[120px] overflow-hidden text-ellipsis"
          >
            <span className="mr-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
              {value.label}
            </span>
            <button
              type="button"
              onClick={() => {
                const newValues = values.filter((_, i) => i !== index);
                props.selectProps.onChange?.(newValues, {
                  action: 'remove-value',
                  removedValue: value,
                });
              }}
              className="bg-transparent border-none cursor-pointer text-base text-gray-600 p-0 ml-1"
            >
              ×
            </button>
          </div>
        ))}
        {remainingCount > 0 && (
          <span className="text-gray-600 text-sm px-1.5 py-0.5 bg-gray-100 rounded ml-1 whitespace-nowrap flex-shrink-0">
            +{remainingCount}
          </span>
        )}
        {/* This ensures the input field is still rendered and functional */}
        <div className="flex-1 min-w-[120px]">{children}</div>
      </div>
    </components.ValueContainer>
  );
};

const customStyles: StylesConfig<SelectOption> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    borderColor: '#d1d5db', // gray-300
    '&:hover': {
      borderColor: '#9ca3af', // gray-400
    },
    '&:focus': {
      borderColor: '#3b82f6', // blue-500
      boxShadow: '0 0 0 1px #3b82f6',
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: '2px 8px',
    flexWrap: 'nowrap', // Prevent wrapping
    alignItems: 'center',
    overflow: 'hidden', // Hide overflow content
  }),
  multiValue: (styles) => ({
    ...styles,
    display: 'none', // Hide default multi-value tags
  }),
  input: (styles) => ({
    ...styles,
    flex: 1,
    minWidth: '120px',
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb', // gray-200
    borderRadius: '6px',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#dbeafe' // blue-100
      : isFocused
        ? '#f3f4f6' // gray-100
        : 'white',
    color: isSelected ? '#1d4ed8' : '#374151', // blue-700 : gray-700
    '&:hover': {
      backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6',
    },
  }),
};