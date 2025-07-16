export const checkConnection = async () => {
  const permissions = await window.arweaveWallet.getPermissions();
  if (permissions.length > 0) {
    return true;
  } else {
    return false;
  }
};
