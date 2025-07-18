const commonHiddenFields = [
  "type",
  "application_method.type",
  "application_method.allocation",
]

const amountOfOrderHiddenFields = [...commonHiddenFields]
const amountOfProductHiddenFields = [...commonHiddenFields]

const percentageOfOrderHiddenFields = [
  ...commonHiddenFields,
  "is_tax_inclusive",
]
const percentageOfProductHiddenFields = [
  ...commonHiddenFields,
  "is_tax_inclusive",
]

const buyGetHiddenFields = [
  ...commonHiddenFields,
  "application_method.value",
  "is_tax_inclusive",
]

export const templates = [
  {
    id: "amount_off_products",
    type: "standard",
    title: "Amount off products",
    description: "Discount specific products or collection of products",
    hiddenFields: amountOfProductHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "each",
        target_type: "items",
        type: "fixed",
      },
    },
  },
  {
    id: "amount_off_order",
    type: "standard",
    title: "Amount off order",
    description: "Discounts the total order amount",
    hiddenFields: amountOfOrderHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "across",
        target_type: "order",
        type: "fixed",
      },
    },
  },
  {
    id: "percentage_off_product",
    type: "standard",
    title: "Percentage off product",
    description: "Discounts a percentage off selected products",
    hiddenFields: percentageOfProductHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "each",
        target_type: "items",
        type: "percentage",
      },
    },
  },
  {
    id: "percentage_off_order",
    type: "standard",
    title: "Percentage off order",
    description: "Discounts a percentage of the total order amount",
    hiddenFields: percentageOfOrderHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "standard",
      application_method: {
        allocation: "across",
        target_type: "order",
        type: "percentage",
      },
    },
  },
  {
    id: "buy_get",
    type: "buy_get",
    title: "Buy X Get Y",
    description: "Buy X product(s), get Y product(s)",
    hiddenFields: buyGetHiddenFields,
    defaults: {
      is_automatic: "false",
      type: "buyget",
      application_method: {
        type: "percentage",
        value: 100,
        apply_to_quantity: 1,
        max_quantity: 1,
      },
    },
  },
]
