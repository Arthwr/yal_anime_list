const statusTagColors = {
  FINISHED: "success",
  RELEASING: "warning",
  NOT_YET_RELEASED: "warning",
  CANCELLED: "danger",
  HIATUS: "danger",
};

module.exports = {
  getStatusColor: (status) => {
    return statusTagColors[status] || "neutral";
  },

  convertUserScore: (score, maxScore = 5) => {
    if (typeof score !== "number" || score < 0 || score > 100) {
      return 0;
    }

    return Math.round((score / 100) * maxScore * 10) / 10;
  },

  convertStatusName: (string) => {
    if (typeof string !== "string" || !string) {
      return string;
    }

    return string
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },

  convertToHtmlValues: (string) => {
    return string.replace(/ /g, "_");
  },

  convertFormState: (data) => {
    if (!data) return null;

    if (Array.isArray(data)) return data.join(" ");

    return data;
  },
};
