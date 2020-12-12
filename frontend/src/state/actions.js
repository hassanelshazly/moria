export const actionTypes = {
  SET_USER: "SET_USER",
  SET_MENU_ANCHOR: "SET_MENU_ANCHOR",
};

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
  };
}

export function setMenuAnchor(menu, anchor) {
  return {
    type: actionTypes.SET_MENU_ANCHOR,
    menu,
    anchor,
  };
}
