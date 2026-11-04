
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// =====================================================
// TYPES
// =====================================================

export type CartItem = {
  id: number;
  product_id?: number;
  variant_id?: number;
  product_code?: string;
  sku?: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category_code?: string;
  size_label?: string | null;
  size_code?: string | null;
  color?: string | null;
  max_quantity?: number;
  quantity: number;
};

type AddToCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export type CombinationOffer = {
  completeLookCount: number;
  completeLookDiscount: number;
  completeLookItemsMatched: number;

  pickAny2Count: number;
  pickAny2Discount: number;
  pickAny2ItemsMatched: number;

  totalDiscount: number;
};

type CartContextType = {
  cartItems: CartItem[];

  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;

  cartCount: number;
  cartTotal: number;

  combinationOffer: CombinationOffer;
  bundleDiscount: number;
  discountedCartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const STORAGE_KEY = "cartItems";

const COMPLETE_LOOK_DISCOUNT_RATE = 0.15;
const PICK_ANY2_DISCOUNT_RATE = 0.10;

// =====================================================
// PRODUCT CLASSIFICATION
// =====================================================

type ProductType = "tshirt" | "hoodie" | "cap" | "other";

function getProductType(item: CartItem): ProductType {
  const category = (item.category_code ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  // Exact database category codes.
  const categoryMap: Record<string, ProductType> = {
    tshirts: "tshirt",
    tshirt: "tshirt",
    tee: "tshirt",
    tees: "tshirt",

    hoodies: "hoodie",
    hoodie: "hoodie",

    caps: "cap",
    cap: "cap",
  };

  if (categoryMap[category]) {
    return categoryMap[category];
  }

  // Fallback classification.
  const searchableText = [
    item.name,
    item.slug,
    item.product_code,
    item.sku,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/\b(hoodie|hoodies)\b/i.test(searchableText)) {
    return "hoodie";
  }

  if (/\b(t[\s-]?shirts?|tees?)\b/i.test(searchableText)) {
    return "tshirt";
  }

  if (/\b(caps?)\b/i.test(searchableText)) {
    return "cap";
  }

  return "other";
}

// =====================================================
// MONEY ROUNDING
// =====================================================

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// =====================================================
// COMBINATION OFFER CALCULATION
// =====================================================

function calculateCombinationOffer(
  items: CartItem[]
): CombinationOffer {
  type Unit = {
    price: number;
    type: ProductType;
  };

  const tshirtUnits: Unit[] = [];
  const hoodieUnits: Unit[] = [];
  const capUnits: Unit[] = [];

  // ---------------------------------------------------
  // EXPAND CART QUANTITIES INTO INDIVIDUAL UNITS
  // ---------------------------------------------------

  for (const item of items) {
    const quantity = Math.max(
      0,
      Math.floor(Number(item.quantity) || 0)
    );

    const price = Math.max(
      0,
      Number(item.price) || 0
    );

    if (
      quantity === 0 ||
      !Number.isFinite(price)
    ) {
      continue;
    }

    const productType = getProductType(item);

    const unit: Unit = {
      price,
      type: productType,
    };

    for (let i = 0; i < quantity; i++) {
      if (productType === "tshirt") {
        tshirtUnits.push({ ...unit });
      } else if (productType === "hoodie") {
        hoodieUnits.push({ ...unit });
      } else if (productType === "cap") {
        capUnits.push({ ...unit });
      }
    }
  }

  // ---------------------------------------------------
  // SORT EACH CATEGORY BY HIGHEST PRICE
  // ---------------------------------------------------

  tshirtUnits.sort((a, b) => b.price - a.price);
  hoodieUnits.sort((a, b) => b.price - a.price);
  capUnits.sort((a, b) => b.price - a.price);

  // ---------------------------------------------------
  // OFFER 1: COMPLETE LOOK
  // 1 T-SHIRT + 1 HOODIE + 1 CAP = 15% OFF
  // ---------------------------------------------------

  const completeLookCount = Math.min(
    tshirtUnits.length,
    hoodieUnits.length,
    capUnits.length
  );

  let completeLookSubtotal = 0;

  for (let i = 0; i < completeLookCount; i++) {
    completeLookSubtotal += tshirtUnits[i].price;
    completeLookSubtotal += hoodieUnits[i].price;
    completeLookSubtotal += capUnits[i].price;
  }

  const completeLookDiscount = roundMoney(
    completeLookSubtotal * COMPLETE_LOOK_DISCOUNT_RATE
  );

  // ---------------------------------------------------
  // OFFER 2: PICK ANY 2
  // ONLY AVAILABLE WHEN THERE IS NO COMPLETE LOOK
  // ANY TWO APPAREL ITEMS = 10% OFF
  // ---------------------------------------------------

  let pickAny2Count = 0;
  let pickAny2Discount = 0;
  let pickAny2ItemsMatched = 0;

  // IMPORTANT:
  // If even one Complete Look exists, Pick Any 2
  // is completely disabled for the entire cart.
  if (completeLookCount === 0) {
    const eligibleUnits = [
      ...tshirtUnits,
      ...hoodieUnits,
      ...capUnits,
    ];

    // Highest-priced products receive priority.
    eligibleUnits.sort((a, b) => b.price - a.price);

    pickAny2Count = Math.floor(
      eligibleUnits.length / 2
    );

    const matchedUnits = pickAny2Count * 2;

    let pickAny2Subtotal = 0;

    for (let i = 0; i < matchedUnits; i++) {
      pickAny2Subtotal += eligibleUnits[i].price;
    }

    pickAny2Discount = roundMoney(
      pickAny2Subtotal * PICK_ANY2_DISCOUNT_RATE
    );

    pickAny2ItemsMatched = matchedUnits;
  }

  // ---------------------------------------------------
  // TOTAL DISCOUNT
  // ONLY ONE OFFER CAN APPLY
  // ---------------------------------------------------

  const totalDiscount = roundMoney(
    completeLookCount > 0
      ? completeLookDiscount
      : pickAny2Discount
  );

  return {
    completeLookCount,
    completeLookDiscount,
    completeLookItemsMatched: completeLookCount * 3,

    pickAny2Count,
    pickAny2Discount,
    pickAny2ItemsMatched,

    totalDiscount,
  };
}

// =====================================================
// CART PROVIDER
// =====================================================

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // ---------------------------------------------------
  // LOAD CART
  // ---------------------------------------------------

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];

        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // ---------------------------------------------------
  // SAVE CART
  // ---------------------------------------------------

  useEffect(() => {
    if (!isCartLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems, isCartLoaded]);

  // ---------------------------------------------------
  // ADD TO CART
  // ---------------------------------------------------

  const addToCart = (item: AddToCartItem) => {
    setCartItems((prev) => {
      const quantityToAdd = Math.max(
        1,
        Math.floor(Number(item.quantity) || 1)
      );

      const existing = prev.find(
        (product) => product.id === item.id
      );

      if (existing) {
        const maxQuantity =
          existing.max_quantity ?? item.max_quantity;

        const nextQuantity =
          existing.quantity + quantityToAdd;

        return prev.map((product) =>
          product.id === item.id
            ? {
                ...product,
                quantity: maxQuantity
                  ? Math.min(nextQuantity, maxQuantity)
                  : nextQuantity,
              }
            : product
        );
      }

      const maxQuantity = item.max_quantity;

      const safeQuantity = maxQuantity
        ? Math.min(quantityToAdd, maxQuantity)
        : quantityToAdd;

      return [
        ...prev,
        {
          ...item,
          quantity: safeQuantity,
        },
      ];
    });
  };

  // ---------------------------------------------------
  // REMOVE FROM CART
  // ---------------------------------------------------

  const removeFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ---------------------------------------------------
  // INCREASE QUANTITY
  // ---------------------------------------------------

  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const maxQuantity = item.max_quantity;

        return {
          ...item,
          quantity: maxQuantity
            ? Math.min(item.quantity + 1, maxQuantity)
            : item.quantity + 1,
        };
      })
    );
  };

  // ---------------------------------------------------
  // DECREASE QUANTITY
  // ---------------------------------------------------

  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ---------------------------------------------------
  // CLEAR CART
  // ---------------------------------------------------

  const clearCart = () => {
    setCartItems([]);
  };

  // ---------------------------------------------------
  // CART COUNT
  // ---------------------------------------------------

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cartItems]
  );

  // ---------------------------------------------------
  // ORIGINAL CART TOTAL
  // ---------------------------------------------------

  const cartTotal = useMemo(
    () =>
      roundMoney(
        cartItems.reduce(
          (sum, item) =>
            sum + Number(item.price) * item.quantity,
          0
        )
      ),
    [cartItems]
  );

  // ---------------------------------------------------
  // AUTOMATIC COMBINATION OFFERS
  // ---------------------------------------------------

  const combinationOffer = useMemo(
    () => calculateCombinationOffer(cartItems),
    [cartItems]
  );

  const bundleDiscount = combinationOffer.totalDiscount;

  // ---------------------------------------------------
  // DISCOUNTED CART TOTAL
  // ---------------------------------------------------

  const discountedCartTotal = Math.max(
    0,
    roundMoney(cartTotal - bundleDiscount)
  );

  // ---------------------------------------------------
  // PROVIDER
  // ---------------------------------------------------

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,

        cartCount,
        cartTotal,

        combinationOffer,
        bundleDiscount,
        discountedCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
