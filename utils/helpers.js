module.exports = {
  convertUserScore: (score, maxScore = 5) => {
    if (typeof score !== "number" || score < 0 || score > 100) {
      return 0;
    }

    return parseFloat((score / 100) * maxScore).toFixed(1);
  },
};
