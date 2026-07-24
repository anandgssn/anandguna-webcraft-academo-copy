function kelvinToRgb(kelvin: number) {
  const temperature = kelvin / 100;
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  const red = temperature <= 66 ? 255 : 329.698727466 * Math.pow(temperature - 60, -0.1332047592);
  const green = temperature <= 66
    ? 99.4708025861 * Math.log(temperature) - 161.1195681661
    : 288.1221695283 * Math.pow(temperature - 60, -0.0755148492);
  const blue = temperature >= 66 ? 255 : temperature <= 19 ? 0 : 138.5177312231 * Math.log(temperature - 10) - 305.0447927307;
  return [clamp(red), clamp(green), clamp(blue)];
}

export function mountColourTemperature(root: HTMLElement) {
  root.innerHTML = `
    <div class="colour-temperature-layout">
      <div class="colour-temperature-display" aria-label="Colour emitted at the selected temperature"></div>
      <div class="colour-temperature-controls">
        <div class="colour-temperature-control">
          <label for="colour-temperature-value">Temperature</label>
          <div class="colour-temperature-value"><input id="colour-temperature-value" type="number" min="1500" max="15000" step="1" value="1500"><span>K</span></div>
          <input class="colour-temperature-range" type="range" min="1500" max="15000" step="1" value="1500" aria-label="Temperature slider">
        </div>
        <p class="colour-temperature-output"><span>Color:</span><br><span data-rgb></span><br>Hex: <span data-hex></span></p>
      </div>
    </div>`;

  const display = root.querySelector<HTMLElement>(".colour-temperature-display")!;
  const numberInput = root.querySelector<HTMLInputElement>("#colour-temperature-value")!;
  const rangeInput = root.querySelector<HTMLInputElement>(".colour-temperature-range")!;
  const rgbOutput = root.querySelector<HTMLElement>("[data-rgb]")!;
  const hexOutput = root.querySelector<HTMLElement>("[data-hex]")!;

  function update(source: HTMLInputElement, target: HTMLInputElement) {
    const value = Math.max(1500, Math.min(15000, Number(source.value)));
    source.value = String(value);
    target.value = String(value);
    const rgb = kelvinToRgb(value);
    const hex = `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    display.style.backgroundColor = `rgb(${rgb.join(",")})`;
    rgbOutput.textContent = `rgb(${rgb[0]},${rgb[1]}, ${rgb[2]})`;
    hexOutput.textContent = hex;
    const progress = ((value - 1500) / 13500) * 100;
    rangeInput.style.setProperty("--range-progress", `${progress}%`);
  }

  numberInput.addEventListener("change", () => update(numberInput, rangeInput));
  rangeInput.addEventListener("input", () => update(rangeInput, numberInput));
  update(numberInput, rangeInput);
}
