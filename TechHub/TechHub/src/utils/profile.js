export const emptyAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

export const normalizeAddress = (address) => ({
  ...emptyAddress,
  ...(address || {}),
});

export const getInitialProfileForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: normalizeAddress(user?.address),
});





