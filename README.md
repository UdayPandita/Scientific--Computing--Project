# Euler Family ODE Solver - Web Application

A beautiful, interactive web application for solving Ordinary Differential Equations (ODEs) using various Euler family methods.

## Features

### 🎯 Core Functionality
- Solve ODEs using 5 different methods:
  - **Euler's Method**
  - **Improved Euler (Heun's Method)**
  - **Modified Euler**
  - **Improved Modified Euler**
  - **AIME (Adams Improved Modified Euler)**

### 📊 Visualization
- Interactive plots using Plotly
- Real-time solution visualization
- Error analysis plots
- Compare all methods simultaneously

### 📈 Analysis Features
- Data tables with numerical results
- Error statistics (Maximum, Average, Final errors)
- Side-by-side method comparison
- Exact solution comparison (if provided)

## How to Use

### 1. Open the Application
Simply open `index.html` in your web browser:
- Double-click the `index.html` file, or
- Right-click → Open With → Your preferred browser

### 2. Enter Problem Details

#### ODE Function
- Enter your differential equation as `f(x, y)` where `dy/dx = f(x, y)`
- Example: `y - x^2 + 1`
- Use `^` for powers, `*` for multiplication
- Available functions: `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, etc.

#### Initial Conditions
- **x₀**: Initial x value
- **y₀**: Initial y value
- **xₙ**: Final x value
- **h**: Step size

#### Optional Exact Solution
- Check "I have an exact solution" if you know the analytical solution
- Enter the exact solution as a function of x
- Example: `(x + 1)^2 - 0.5*exp(x)`

### 3. Choose Method
Select one of the 5 available methods from the dropdown menu.

### 4. Solve
Click **"🚀 Solve ODE"** to:
- Compute the solution using your selected method
- View the solution plot
- See numerical data in a table
- Analyze errors (if exact solution provided)

### 5. Compare Methods
Click **"📊 Compare All Methods"** to:
- Solve using all 5 methods simultaneously
- Compare solutions visually
- View error comparison plot
- See all results in one table

## Example Problems

### Example 1: Simple ODE
```
ODE: y - x^2 + 1
x₀ = 0
y₀ = 0.5
xₙ = 2
h = 0.2
Exact: (x + 1)^2 - 0.5*exp(x)
```

### Example 2: Exponential Growth
```
ODE: y
x₀ = 0
y₀ = 1
xₙ = 2
h = 0.1
Exact: exp(x)
```

### Example 3: Trigonometric
```
ODE: cos(x)
x₀ = 0
y₀ = 0
xₙ = 3.14159
h = 0.1
Exact: sin(x)
```

## Browser Compatibility

Works best on modern browsers:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Technical Details

### Libraries Used
- **Plotly.js** - Interactive plotting
- **Math.js** - Mathematical expression parsing and evaluation

### Methods Implemented

1. **Euler's Method**
   - Basic forward Euler method
   - First-order accuracy

2. **Improved Euler (Heun's Method)**
   - Predictor-corrector approach
   - Second-order accuracy

3. **Modified Euler**
   - Midpoint method
   - Second-order accuracy

4. **Improved Modified Euler**
   - Enhanced midpoint approach
   - Higher accuracy

5. **AIME**
   - Adams Improved Modified Euler
   - Most accurate in the family

## Files Structure

```
SC Project/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── script.js           # JavaScript logic and methods
├── main.ipynb          # Jupyter notebook version
├── main.py             # Python script version
└── README.md           # This file
```

## Tips for Best Results

1. **Step Size**: Smaller step sizes (h) give more accurate results but take longer to compute
2. **Range**: Keep the range (xₙ - x₀) reasonable for visual clarity
3. **Exact Solution**: Providing an exact solution enables error analysis
4. **Expression Format**: Use proper mathematical notation:
   - Powers: `x^2` not `x**2` (though both work)
   - Multiplication: Always use `*` (e.g., `2*x` not `2x`)
   - Functions: `sin(x)`, `exp(x)`, `sqrt(x)`, etc.

## Troubleshooting

### "Error parsing expression"
- Check mathematical syntax
- Ensure all variables are x or y
- Use proper operators (`*`, `^`, `/`, etc.)

### Plot not showing
- Ensure all input fields are filled
- Check that step size is positive and reasonable
- Verify that xₙ > x₀

### Methods give very different results
- This might indicate stiffness in the ODE
- Try reducing step size (h)
- Compare with exact solution if available

## Future Enhancements

Possible additions:
- Runge-Kutta methods (RK4)
- Adaptive step size
- System of ODEs
- Export results to CSV
- Save/load problem configurations

## Credits

Created with ❤️ for solving ODEs interactively!

---

**Happy Computing! 🚀**
