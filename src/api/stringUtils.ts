const compare = (
  str?: string,
  search?: string,
  exact: boolean = false,
): boolean => {
  if (!str || !search) {
    return false;
  }
  if (!exact) {
    str = str.toLowerCase();
    search = search.toLowerCase();
  }

  return exact ? str === search : str.indexOf(search) >= 0;
};

export { compare };
