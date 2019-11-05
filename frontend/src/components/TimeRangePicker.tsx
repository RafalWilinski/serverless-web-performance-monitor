import React from 'react';
import { Box } from 'rebass';
import { Select } from '@rebass/forms';

interface TimeRangePickerProps {
  options: string[];
  onChange: (val: string) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = (props: TimeRangePickerProps) => {
  return (
    <Box py={1}>
      <Select
        id="country"
        name="country"
        defaultValue="United States"
        onChange={(e: any) => props.onChange(e.target.value)}
      >
        {props.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Select>
    </Box>
  );
};

export default TimeRangePicker;
