import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerPanel = () => {
  const [startDate, setStartDate] = useState(new Date("2020-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
      <h3>📅 Select Time Range</h3>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div>
          <label>From: </label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
        <div>
          <label>To: </label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>
    </div>
  );
};

export default DatePickerPanel;
