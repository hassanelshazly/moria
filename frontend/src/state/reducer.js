import { actionTypes } from "./actions";

export const initialState = {
  user: null,
  menus: { account: null },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.user };

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
