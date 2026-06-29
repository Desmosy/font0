"use client";

import { useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Format the value shown inside the drag tooltip. Defaults to the raw value. */
  formatTooltip?: (value: number) => string;
  "aria-label"?: string;
  className?: string;
}

/**
 * Slim track + tall pill thumb slider with a value tooltip on hover/drag.
 * Wraps a native range input for keyboard/pointer accessibility while
 * rendering custom visuals driven by the value percentage.
 */
export default function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatTooltip,
  className,
  ...rest
}: SliderProps) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const tooltip = formatTooltip ? formatTooltip(value) : String(value);
  const showTooltip = active || hovered;

  return (
    <div
      className={`ui-slider${className ? ` ${className}` : ""}`}
      data-active={active || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ui-slider__track">
        <div className="ui-slider__range" style={{ width: `${pct}%` }} />
      </div>

      <div className="ui-slider__thumb" style={{ left: `${pct}%` }} aria-hidden>
        <span
          className="ui-slider__tooltip"
          data-show={showTooltip || undefined}
        >
          {tooltip}
        </span>
      </div>

      <input
        type="range"
        className="ui-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onPointerDown={() => setActive(true)}
        onPointerUp={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        {...rest}
      />
    </div>
  );
}
