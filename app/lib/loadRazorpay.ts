declare global {
  interface Window {
    Razorpay: any;
  }
}

let razorpayPromise: Promise<boolean> | null = null;

function waitForRazorpay(timeoutMs = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }

      setTimeout(check, 150);
    };

    check();
  });
}

export function loadRazorpaySdk(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayPromise) {
    return razorpayPromise;
  }

  razorpayPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      waitForRazorpay().then(resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = async () => {
      const ready = await waitForRazorpay();
      resolve(ready);
    };

    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });

  return razorpayPromise;
}

export async function loadRazorpayWithRetry(
  retries = 3,
  delayMs = 1500
): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const loaded = await loadRazorpaySdk();

    if (loaded && typeof window !== "undefined" && window.Razorpay) {
      return true;
    }

    razorpayPromise = null;

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
}