export const actionTypes = {
  SET_USER: "SET_USER",
  SET_DIALOG: "SET_DIALOG",
  SHOW_SNACKBAR: "SHOW_SNACKBAR",
  SET_SNACKBAR: "SET_SNACKBAR",
  FILL_FORM: "FILL_FORM",
  SET_MENU_ANCHOR: "SET_MENU_ANCHOR",
};

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
  };
}

export function setDialog(dialog) {
  return {
    type: actionTypes.SET_DIALOG,
    dialog,
  };
}

export function showSnackbar(variant, message, actionLabel, action) {
  return {
    type: actionTypes.SHOW_SNACKBAR,
    variant,
    message,
    actionLabel,
    action,
  };
}

export function setSnackbar(open, messageInfo) {
  return {
    type: actionTypes.SET_SNACKBAR,
    open,
    messageInfo,
  };
}

export function fillForm(form, fields) {
  return {
    type: actionTypes.FILL_FORM,
    form,
    fields,
  };
}

export function setMenuAnchor(menu, anchor) {
  return {
    type: actionTypes.SET_MENU_ANCHOR,
    menu,
    anchor,
  };
}
