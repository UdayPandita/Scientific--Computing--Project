import numpy as np
import matplotlib.pyplot as plt
from sympy import symbols, lambdify, sympify

# --- All Methods ---
def euler(f, x0, y0, h, n):
    x, y = [x0], [y0]
    for _ in range(n):
        y.append(y[-1] + h * f(x[-1], y[-1]))
        x.append(x[-1] + h)
    return np.array(x), np.array(y)

def improved_euler(f, x0, y0, h, n):
    x, y = [x0], [y0]
    for _ in range(n):
        k1 = f(x[-1], y[-1])
        k2 = f(x[-1] + h, y[-1] + h * k1)
        y.append(y[-1] + (h / 2) * (k1 + k2))
        x.append(x[-1] + h)
    return np.array(x), np.array(y)

def modified_euler(f, x0, y0, h, n):
    x, y = [x0], [y0]
    for _ in range(n):
        y_mid = y[-1] + (h / 2) * f(x[-1], y[-1])
        y.append(y[-1] + h * f(x[-1] + h / 2, y_mid))
        x.append(x[-1] + h)
    return np.array(x), np.array(y)

def improved_modified_euler(f, x0, y0, h, n):
    x, y = [x0], [y0]
    for _ in range(n):
        y_inner = y[-1] + h * f(x[-1], y[-1])
        y_mid = y[-1] + (h / 2) * f(x[-1], y_inner)
        y.append(y[-1] + h * f(x[-1] + h / 2, y_mid))
        x.append(x[-1] + h)
    return np.array(x), np.array(y)

def aime(f, x0, y0, h, n):
    x, y = [x0], [y0]
    for _ in range(n):
        y_half = y[-1] + (h / 2) * f(x[-1], y[-1])
        y.append(y[-1] + h * f(x[-1] + h / 2, y_half))
        x.append(x[-1] + h)
    return np.array(x), np.array(y)

# --- Main Program ---
if __name__ == "__main__":
    print("\n=== Euler Family ODE Solver (All Methods) ===")
    print("Enter ODE in form dy/dx = f(x, y), e.g., y - x**2 + 1")
    f_expr = input("f(x, y) = ")

    x_sym, y_sym = symbols('x y')
    f = lambdify((x_sym, y_sym), sympify(f_expr), 'numpy')

    # --- Inputs ---
    x0 = float(input("Enter x0 (initial x): "))
    y0 = float(input("Enter y0 (initial y): "))
    xn = float(input("Enter xn (final x): "))
    h = float(input("Enter step size h: "))
    n = int((xn - x0) / h)

    # --- Optional exact solution ---
    exact_opt = input("Do you have an exact solution? (y/n): ").strip().lower()
    exact_func = None
    if exact_opt == 'y':
        y_exact_expr = input("Enter exact y(x): ")
        exact_func = lambdify(x_sym, sympify(y_exact_expr), 'numpy')

    # --- Compute solutions ---
    methods = {
        "Euler": euler,
        "Improved Euler": improved_euler,
        "Modified Euler": modified_euler,
        "Improved Modified Euler": improved_modified_euler,
        "AIME": aime
    }

    results = {}
    for name, method in methods.items():
        x, y = method(f, x0, y0, h, n)
        results[name] = (x, y)

    # --- Determine reference (exact or AIME) ---
    if exact_func:
        y_ref = exact_func(results["AIME"][0])
        ref_name = "Exact Solution"
    else:
        y_ref = results["AIME"][1]
        ref_name = "AIME (Reference)"

    # --- Plot Solutions ---
    plt.figure(figsize=(9, 6))
    for name, (x, y) in results.items():
        plt.plot(x, y, marker='o', label=name)
    plt.plot(results["AIME"][0], y_ref, 'k--', linewidth=2, label=ref_name)
    plt.xlabel("x")
    plt.ylabel("y")
    plt.title("Numerical Solutions for All Methods")
    plt.legend()
    plt.grid(True)
    plt.show()

    # --- Compute and Plot Errors ---
    plt.figure(figsize=(9, 6))
    for name, (x, y) in results.items():
        error = np.abs(y - y_ref)
        plt.plot(x, error, marker='o', label=f"{name} Error")
    plt.xlabel("x")
    plt.ylabel("Absolute Error")
    plt.title("Error Comparison (AIME or Exact as Reference)")
    plt.legend()
    plt.grid(True)
    plt.show()

    # --- Display Final Results ---
    print("\n--- Final Results ---")
    for name, (x, y) in results.items():
        print(f"\n{name}:")
        for xi, yi in zip(x, y):
            print(f"x={xi:.3f}, y={yi:.6f}")
