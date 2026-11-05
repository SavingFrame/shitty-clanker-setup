// Rex's native remote transport does not set SSH markers. Route Pi copies
// to the terminal client's clipboard instead of only the server's desktop.
export default function () {
  if (process.env.TERM_PROGRAM === "rex") {
    // Preserve explicit user configuration, including an opt-out of "0".
    process.env.PI_CLIPBOARD_OSC52 ??= "1";
  }
}
