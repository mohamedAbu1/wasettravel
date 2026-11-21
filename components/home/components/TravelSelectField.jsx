"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";

export default function TravelSelectField({ label, value, onChange, options = [], icon, className = "", placeholder, disabled = false, compact = false }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const chooseOption = (option) => {
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!options.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + options.length) % options.length);
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
    }
    if ((event.key === "Enter" || event.key === " ") && open && options[activeIndex]) {
      event.preventDefault();
      chooseOption(options[activeIndex]);
    }
  };

  return (
    <div ref={rootRef} className={`travel-select-field ${compact ? "travel-select-field--compact" : ""} ${open ? "is-open" : ""} ${className}`}>
      {icon ? <span className="travel-field-icon" aria-hidden="true">{icon}</span> : null}
      <button
        ref={triggerRef}
        type="button"
        className="travel-select-trigger"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={`travel-select-value ${selectedOption ? "is-selected" : ""}`}>
          {selectedOption?.label || placeholder || `Choose ${label}`}
        </span>
        <FaChevronDown className="travel-select-chevron" aria-hidden="true" />
      </button>

      {open ? (
        <div id={listboxId} className="travel-select-menu" role="listbox" aria-label={label} aria-activedescendant={`${listboxId}-option-${activeIndex}`}>
          {options.length ? options.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`travel-select-option ${option.value === value ? "is-selected" : ""} ${index === activeIndex ? "is-active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => chooseOption(option)}
            >
              <span>{option.label}</span>
              {option.value === value ? <FaCheck aria-hidden="true" /> : null}
            </button>
          )) : <p className="travel-select-empty">No options available</p>}
        </div>
      ) : null}
    </div>
  );
}
