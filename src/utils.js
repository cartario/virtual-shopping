export const NAVIGATOR_TYPES = {
  screen1: 'vegetableScene',
  screen2: 'sweetScene',
  screen3: 'drinkScene',
  screen4: 'groceryScene',
  login: 'login',
  menu: 'menu',
  cart: 'cart',
  payment: 'payment',
  arProductInfo: 'arProductInfo'
};

export const JUMP_TYPES = {
  drinks: 'drinks',
  orders: 'ordersScene',
  exit: 'exit',
  info: 'infoScene',
  cart: 'cart'  
}

export const fireBaseAdapter = (response) => {
  if (!response) {
    return;
  }
  const keys = Object.keys(response);

  return keys.map((key) => {
    return {
      _id: key,
      ...response[key],
    };
  });
};


