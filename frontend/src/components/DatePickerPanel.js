import React from "react";
import DatePicker from "react-datepicker";


const DatePickerPanel = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div>
      <p><strong>Select Date Range:</strong></p>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="From"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="To"
      />
    </div>
  );
};

export default DatePickerPanel;
