"use client";

import { InputAdornment, MenuItem, TextField } from "@mui/material";

export default function TravelSelectField({ label, value, onChange, options, icon, className = "" }) {
  return (
    <TextField
      className={`travel-select-field ${className}`}
      select
      fullWidth
      label={label}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      InputProps={icon ? { startAdornment: <InputAdornment position="start">{icon}</InputAdornment> } : undefined}
      inputProps={{ "aria-label": label }}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => selected || <span className="travel-select-placeholder">Choose {label}</span>,
        MenuProps: {
          PaperProps: { className: "travel-select-menu" },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} className="travel-select-option">
          {icon ? <span className="travel-select-option__icon" aria-hidden="true">{icon}</span> : null}
          <span className="travel-select-option__label">{option.label}</span>
          <span className="travel-select-option__check" aria-hidden="true">✓</span>
        </MenuItem>
      ))}
    </TextField>
  );
}
