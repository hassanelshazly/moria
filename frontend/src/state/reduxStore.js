import { createStore } from "redux";

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

export const initialState = {
  user: null,
  dialog: null,
  snackbar: { queue: [], open: false, messageInfo: undefined },
  menus: { account: null },
  forms: {
    post: {
      type: "",
      id: "",
    },
  },
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.user };

    case actionTypes.SET_DIALOG:
      return { ...state, dialog: action.dialog };

    case actionTypes.SHOW_SNACKBAR: {
      const newQueue = [
        ...state.snackbar.queue,
        {
          key: new Date().getTime(),
          variant: action.variant,
          message: action.message,
          actionLabel: action.actionLabel,
          action: action.action,
        },
      ];
      let open = undefined,
        messageInfo = undefined;
      if (!state.open) {
        if (newQueue.length > 0) {
          open = true;
          messageInfo = newQueue.shift();
        }
      }
      return {
        ...state,
        snackbar: {
          open: open ? open : state.open,
          messageInfo: messageInfo ? messageInfo : state.open,
          queue: newQueue,
        },
      };
    }

    case actionTypes.SET_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: action.open,
          messageInfo: action.messageInfo
            ? action.messageInfo
            : state.snackbar.messageInfo,
        },
      };

    case actionTypes.FILL_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.form]: action.fields,
        },
      };

    case actionTypes.SET_MENU_ANCHOR:
      return {
        ...state,
        menus: {
          ...state.menus,
          [action.menu]: action.anchor,
        },
      };

    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
