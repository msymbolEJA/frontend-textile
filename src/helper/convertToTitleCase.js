export const convertToTitleCase = str => {
  const words = str?.trim()?.split("_");

  const capitalizedWords = words?.map(word => {
    return word?.charAt(0).toUpperCase() + word?.slice(1);
  });

  return capitalizedWords?.join(" ");
};
