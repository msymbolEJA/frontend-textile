export const getQueryParams = (t = window.location.search) => {
  if (!t || "string" != typeof t || t.length < 2) return [];
  return t
    ?.replace("?", "")
    .split("&")
    .reduce(
      (r, e) => ((r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1])), r),
      {}
    );
};

// const getQueryParams2 = () =>
//   window.location.search
//     ?.replace("?", "")
//     .split("&")
//     .reduce(
//       (r, e) => ((r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1])), r),
//       {}
//     );
