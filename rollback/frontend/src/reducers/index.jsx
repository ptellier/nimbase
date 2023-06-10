const JSON_string = `[{"id":1,"itemName":"Book","description":"A great book to read.","price":"10.00","quantity":"5","image":"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTA3NzZ8MHwxfHNlYXJjaHwxfHxib29rfGVufDB8fHx8MTY4NDg0NzEyN3ww&ixlib=rb-4.0.3&q=80&w=1080"},{"id":2,"itemName":"Shirt","description":"A nice shirt to wear.","price":"20.00","quantity":"10","image":"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTA3NzZ8MHwxfHNlYXJjaHwxfHxzaGlydHxlbnwwfHx8fDE2ODQ4NDcxNjR8MA&ixlib=rb-4.0.3&q=80&w=1080"},{"id":3,"itemName":"Hat","description":"A stylish hat to wear.","price":"15.00","quantity":"20","image":"https://images.unsplash.com/photo-1521369909029-2afed882baee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTA3NzZ8MHwxfHNlYXJjaHwxfHxoYXR8ZW58MHx8fHwxNjg0ODQ3MTg4fDA&ixlib=rb-4.0.3&q=80&w=1080"}]`;

const initialState = {
  items: JSON.parse(JSON_string),
  selectedItem: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, id: state.items.length + 1 },
        ],
      };

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.payload,
      };
    case "CLOSE_DETAILS":
      return {
        ...state,
        selectedItem: null,
      };
    case "DELETE_INVENTORY":
      return {
        ...state,
        items: [],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            console.log(
              parseInt(item.quantity) + parseInt(action.payload.counter)
            );
            return {
              ...item,
              quantity:
                parseInt(item.quantity) + parseInt(action.payload.counter),
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
};

export default rootReducer;
