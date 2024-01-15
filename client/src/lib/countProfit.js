export function countProfit(bPrice, sPrice, shares, commissionDiscount) {
  const result = {
    commission: "-",
    profit: "-",
    ROI: "-",
    tax: "-",
  };
  if (!bPrice || !sPrice || !shares || !commissionDiscount) {
    return result;
  }
  const buyTotal = bPrice * shares;
  const sellTotal = sPrice * shares;

  const commission_1 = Math.floor(buyTotal * 0.001425 * commissionDiscount);
  const commission_2 = Math.floor(sellTotal * 0.001425 * commissionDiscount);

  const taxPrice = Math.floor(sellTotal * 0.003);

  result.profit = +(
    sellTotal -
    buyTotal -
    commission_1 -
    commission_2 -
    taxPrice
  ).toFixed(0);

  result.ROI = ((result.profit / buyTotal) * 100).toFixed(2);

  result.tax = taxPrice;

  result.commission = `${commission_1}+${commission_2}`;

  return result;
}
