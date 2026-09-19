"use client";

export default function TravelSelectField({ label, value, onChange, options, icon, className = "" }) {
  return (
    <div className={`travel-select-field ${className}`}>
      {icon ? <span className="travel-field-icon" aria-hidden="true">{icon}</span> : null}
      <select className="travel-select-native" value={value || ""} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value="">Choose {label}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
