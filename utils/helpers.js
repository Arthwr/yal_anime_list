module.exports = {
  trimText: (text, maxLength = 600) => {
    if (text.length <= maxLength) return text;

    const trimmed = text.substring(0, maxLength);
    const lastSpaceIndex = trimmed.lastIndexOf("<br>");

    return lastSpaceIndex != -1 ? trimmed.substring(0, lastSpaceIndex) + "..." : trimmed + "...";
  },
};
