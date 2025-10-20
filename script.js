// Global variables
let currentResults = null;
let allMethodsResults = null;

// Toggle exact solution input
document.getElementById('has-exact').addEventListener('change', function() {
    document.getElementById('exact-group').style.display = this.checked ? 'block' : 'none';
});

// Numerical Methods Implementation
function euler(f, x0, y0, h, n) {
    const x = [x0];
    const y = [y0];
    
    for (let i = 0; i < n; i++) {
        const y_next = y[i] + h * f(x[i], y[i]);
        const x_next = x[i] + h;
        x.push(x_next);
        y.push(y_next);
    }
    
    return { x, y };
}

function improvedEuler(f, x0, y0, h, n) {
    const x = [x0];
    const y = [y0];
    
    for (let i = 0; i < n; i++) {
        const k1 = f(x[i], y[i]);
        const k2 = f(x[i] + h, y[i] + h * k1);
        const y_next = y[i] + (h / 2) * (k1 + k2);
        const x_next = x[i] + h;
        x.push(x_next);
        y.push(y_next);
    }
    
    return { x, y };
}

function modifiedEuler(f, x0, y0, h, n) {
    const x = [x0];
    const y = [y0];
    
    for (let i = 0; i < n; i++) {
        const y_mid = y[i] + (h / 2) * f(x[i], y[i]);
        const y_next = y[i] + h * f(x[i] + h / 2, y_mid);
        const x_next = x[i] + h;
        x.push(x_next);
        y.push(y_next);
    }
    
    return { x, y };
}

function improvedModifiedEuler(f, x0, y0, h, n) {
    const x = [x0];
    const y = [y0];
    
    for (let i = 0; i < n; i++) {
        const y_inner = y[i] + h * f(x[i], y[i]);
        const y_mid = y[i] + (h / 2) * f(x[i], y_inner);
        const y_next = y[i] + h * f(x[i] + h / 2, y_mid);
        const x_next = x[i] + h;
        x.push(x_next);
        y.push(y_next);
    }
    
    return { x, y };
}

function aime(f, x0, y0, h, n) {
    const x = [x0];
    const y = [y0];
    
    for (let i = 0; i < n; i++) {
        const y_half = y[i] + (h / 2) * f(x[i], y[i]);
        const y_next = y[i] + h * f(x[i] + h / 2, y_half);
        const x_next = x[i] + h;
        x.push(x_next);
        y.push(y_next);
    }
    
    return { x, y };
}

// Get method function by name
function getMethod(methodName) {
    const methods = {
        'euler': euler,
        'improved_euler': improvedEuler,
        'modified_euler': modifiedEuler,
        'improved_modified_euler': improvedModifiedEuler,
        'aime': aime
    };
    return methods[methodName];
}

// Parse mathematical expression
function parseExpression(expr) {
    try {
        // Clean the expression
        expr = expr.trim();
        
        console.log('Original expression:', expr);
        
        // Convert ^ and ** to actual power operations using math.pow
        // First handle ** (double asterisk)
        let processedExpr = expr.replace(/\*\*/g, '^');
        
        console.log('After ** conversion:', processedExpr);
        
        // Add implicit multiplication for patterns like 2x -> 2*x
        processedExpr = processedExpr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        
        console.log('Final processed expression:', processedExpr);
        
        // Try to compile with math.js (it supports ^ natively)
        const node = math.parse(processedExpr);
        const compiled = node.compile();
        
        // Test evaluation
        const testResult = compiled.evaluate({ x: 0, y: 0.5 });
        console.log('Test evaluation at x=0, y=0.5:', testResult);
        
        return (x, y) => {
            try {
                return compiled.evaluate({ x: x, y: y });
            } catch (e) {
                console.error('Evaluation error:', e, 'for x=', x, 'y=', y);
                return NaN;
            }
        };
    } catch (error) {
        console.error('Full parse error:', error);
        alert('Error parsing expression: ' + error.message + '\n\nTry these formats:\n• y - x^2 + 1 (use ^ for power)\n• x*y\n• sin(x) + y\n• exp(x)*y\n\nMake sure to use * for multiplication!');
        return null;
    }
}

// Parse exact solution
function parseExactSolution(expr) {
    try {
        // Clean the expression
        expr = expr.trim();
        
        console.log('Original exact solution:', expr);
        
        // Convert ** to ^
        let processedExpr = expr.replace(/\*\*/g, '^');
        
        // Add implicit multiplication
        processedExpr = processedExpr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        
        console.log('Processed exact solution:', processedExpr);
        
        // Parse and compile
        const node = math.parse(processedExpr);
        const compiled = node.compile();
        
        return (x) => {
            try {
                return compiled.evaluate({ x: x });
            } catch (e) {
                console.error('Evaluation error:', e, 'for x=', x);
                return NaN;
            }
        };
    } catch (error) {
        console.error('Full parse error:', error);
        alert('Error parsing exact solution: ' + error.message + '\n\nTry: (x + 1)^2 - 0.5*exp(x)');
        return null;
    }
}

// Solve ODE with selected method
function solveODE() {
    // Get input values
    const odeInput = document.getElementById('ode-input').value;
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const xn = parseFloat(document.getElementById('xn').value);
    const h = parseFloat(document.getElementById('h').value);
    const methodName = document.getElementById('method-select').value;
    const hasExact = document.getElementById('has-exact').checked;
    const exactInput = document.getElementById('exact-solution').value;
    
    // Validate inputs
    if (!odeInput) {
        alert('Please enter an ODE function');
        return;
    }
    
    // Parse ODE function
    const f = parseExpression(odeInput);
    if (!f) return;
    
    // Parse exact solution if provided
    let exactFunc = null;
    let yExact = null;
    if (hasExact && exactInput) {
        exactFunc = parseExactSolution(exactInput);
        if (!exactFunc) return;
    }
    
    // Calculate number of steps
    const n = Math.round((xn - x0) / h);
    
    // Solve using selected method
    const method = getMethod(methodName);
    const result = method(f, x0, y0, h, n);
    
    // Calculate exact solution if provided
    if (exactFunc) {
        yExact = result.x.map(x => exactFunc(x));
    }
    
    // Store results
    currentResults = {
        method: methodName,
        methodLabel: document.getElementById('method-select').selectedOptions[0].text,
        x: result.x,
        y: result.y,
        yExact: yExact,
        hasExact: hasExact && exactFunc !== null
    };
    
    // Display results
    displayResults(currentResults);
    
    // Show results section
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

// Display results for single method
function displayResults(results) {
    // Plot
    plotSolution(results);
    
    // Table
    displayTable(results);
    
    // Error analysis
    if (results.hasExact) {
        displayErrorAnalysis(results);
    } else {
        document.getElementById('error-stats').innerHTML = '<p>No exact solution provided for error analysis.</p>';
        document.getElementById('error-plot-container').innerHTML = '';
    }
}

// Plot solution
function plotSolution(results) {
    const traces = [{
        x: results.x,
        y: results.y,
        mode: 'lines+markers',
        name: results.methodLabel,
        line: { color: '#667eea', width: 2 },
        marker: { size: 6 }
    }];
    
    if (results.hasExact) {
        traces.push({
            x: results.x,
            y: results.yExact,
            mode: 'lines',
            name: 'Exact Solution',
            line: { color: '#000', width: 2, dash: 'dash' }
        });
    }
    
    const layout = {
        title: `${results.methodLabel} Solution`,
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        hovermode: 'closest',
        showlegend: true
    };
    
    Plotly.newPlot('plot-container', traces, layout);
}

// Display data table
function displayTable(results) {
    let html = '<table><thead><tr><th>x</th><th>y (Numerical)</th>';
    
    if (results.hasExact) {
        html += '<th>y (Exact)</th><th>Absolute Error</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < results.x.length; i++) {
        html += `<tr><td>${results.x[i].toFixed(4)}</td><td>${results.y[i].toFixed(6)}</td>`;
        
        if (results.hasExact) {
            const error = Math.abs(results.y[i] - results.yExact[i]);
            html += `<td>${results.yExact[i].toFixed(6)}</td><td>${error.toExponential(6)}</td>`;
        }
        
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    document.getElementById('table-container').innerHTML = html;
}

// Display error analysis
function displayErrorAnalysis(results) {
    const errors = results.x.map((x, i) => Math.abs(results.y[i] - results.yExact[i]));
    const maxError = Math.max(...errors);
    const finalError = errors[errors.length - 1];
    const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
    
    document.getElementById('error-stats').innerHTML = `
        <h3>Error Statistics</h3>
        <div class="error-stat"><strong>Maximum Error:</strong> ${maxError.toExponential(6)}</div>
        <div class="error-stat"><strong>Final Error:</strong> ${finalError.toExponential(6)}</div>
        <div class="error-stat"><strong>Average Error:</strong> ${avgError.toExponential(6)}</div>
    `;
    
    const trace = {
        x: results.x,
        y: errors,
        mode: 'lines+markers',
        name: 'Absolute Error',
        line: { color: '#f5576c', width: 2 },
        marker: { size: 6 }
    };
    
    const layout = {
        title: 'Absolute Error vs x',
        xaxis: { title: 'x' },
        yaxis: { title: 'Absolute Error', type: 'log' },
        hovermode: 'closest'
    };
    
    Plotly.newPlot('error-plot-container', [trace], layout);
}

// Compare all methods
function compareAllMethods() {
    // Get input values
    const odeInput = document.getElementById('ode-input').value;
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const xn = parseFloat(document.getElementById('xn').value);
    const h = parseFloat(document.getElementById('h').value);
    const hasExact = document.getElementById('has-exact').checked;
    const exactInput = document.getElementById('exact-solution').value;
    
    // Validate inputs
    if (!odeInput) {
        alert('Please enter an ODE function');
        return;
    }
    
    // Parse ODE function
    const f = parseExpression(odeInput);
    if (!f) return;
    
    // Parse exact solution if provided
    let exactFunc = null;
    let yExact = null;
    if (hasExact && exactInput) {
        exactFunc = parseExactSolution(exactInput);
        if (!exactFunc) return;
    }
    
    // Calculate number of steps
    const n = Math.round((xn - x0) / h);
    
    // Solve using all methods
    const methods = {
        'Euler': euler,
        'Improved Euler': improvedEuler,
        'Modified Euler': modifiedEuler,
        'Improved Modified Euler': improvedModifiedEuler,
        'AIME': aime
    };
    
    allMethodsResults = {};
    
    for (const [name, method] of Object.entries(methods)) {
        const result = method(f, x0, y0, h, n);
        allMethodsResults[name] = result;
    }
    
    // Calculate exact solution or use AIME as reference
    if (exactFunc) {
        yExact = allMethodsResults['AIME'].x.map(x => exactFunc(x));
    } else {
        yExact = allMethodsResults['AIME'].y;
    }
    
    // Display comparison
    displayComparison(allMethodsResults, yExact, hasExact && exactFunc !== null);
    
    // Show comparison section
    document.getElementById('comparison-section').style.display = 'block';
    document.getElementById('comparison-section').scrollIntoView({ behavior: 'smooth' });
}

// Display comparison of all methods
function displayComparison(results, yRef, hasExact) {
    // Plot all solutions
    plotAllSolutions(results, yRef, hasExact);
    
    // Plot error comparison
    plotErrorComparison(results, yRef);
    
    // Display comparison table
    displayComparisonTable(results, yRef, hasExact);
}

// Plot all solutions
function plotAllSolutions(results, yRef, hasExact) {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const traces = [];
    
    let i = 0;
    for (const [name, result] of Object.entries(results)) {
        traces.push({
            x: result.x,
            y: result.y,
            mode: 'lines+markers',
            name: name,
            line: { color: colors[i % colors.length], width: 2 },
            marker: { size: 5 }
        });
        i++;
    }
    
    // Add reference solution
    traces.push({
        x: results['AIME'].x,
        y: yRef,
        mode: 'lines',
        name: hasExact ? 'Exact Solution' : 'AIME (Reference)',
        line: { color: '#000', width: 2, dash: 'dash' }
    });
    
    const layout = {
        title: 'Numerical Solutions for All Methods',
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        hovermode: 'closest',
        showlegend: true
    };
    
    Plotly.newPlot('comparison-plot-container', traces, layout);
}

// Plot error comparison
function plotErrorComparison(results, yRef) {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const traces = [];
    
    let i = 0;
    for (const [name, result] of Object.entries(results)) {
        const errors = result.y.map((y, idx) => Math.abs(y - yRef[idx]));
        traces.push({
            x: result.x,
            y: errors,
            mode: 'lines+markers',
            name: name + ' Error',
            line: { color: colors[i % colors.length], width: 2 },
            marker: { size: 5 }
        });
        i++;
    }
    
    const layout = {
        title: 'Error Comparison (Reference as Baseline)',
        xaxis: { title: 'x' },
        yaxis: { title: 'Absolute Error', type: 'log' },
        hovermode: 'closest',
        showlegend: true
    };
    
    Plotly.newPlot('error-comparison-container', traces, layout);
}

// Display comparison table
function displayComparisonTable(results, yRef, hasExact) {
    const x = results['AIME'].x;
    let html = '<table><thead><tr><th>x</th>';
    
    for (const name of Object.keys(results)) {
        html += `<th>${name}</th>`;
    }
    
    if (hasExact) {
        html += '<th>Exact</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < x.length; i++) {
        html += `<tr><td>${x[i].toFixed(4)}</td>`;
        
        for (const result of Object.values(results)) {
            html += `<td>${result.y[i].toFixed(6)}</td>`;
        }
        
        if (hasExact) {
            html += `<td>${yRef[i].toFixed(6)}</td>`;
        }
        
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    document.getElementById('comparison-table-container').innerHTML = html;
}

// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('#results-section .tab-content');
    const buttons = document.querySelectorAll('#results-section .tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function showComparisonTab(tabName) {
    const tabs = document.querySelectorAll('#comparison-section .tab-content');
    const buttons = document.querySelectorAll('#comparison-section .tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}
