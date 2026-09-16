document.addEventListener('DOMContentLoaded', () => {
    // Input Elements
    const platformSelect = document.getElementById('platform');
    const sellingPriceInput = document.getElementById('sellingPrice');
    const cogsInput = document.getElementById('cogs');
    const shippingCostInput = document.getElementById('shippingCost');
    const prepCostInput = document.getElementById('prepCost');
    const adSpendInput = document.getElementById('adSpend');
    const returnRateInput = document.getElementById('returnRate');
    const platformFeePercentInput = document.getElementById('platformFeePercent');
    const platformFeeFixedInput = document.getElementById('platformFeeFixed');
    
    // Output Elements
    const netProfitEl = document.getElementById('netProfit');
    const netMarginEl = document.getElementById('netMargin');
    const trueRoiEl = document.getElementById('trueRoi');
    const breakEvenRoasEl = document.getElementById('breakEvenRoas');
    const totalCostsEl = document.getElementById('totalCosts');
    
    // Breakdown Elements
    const valCogsPrep = document.getElementById('valCogsPrep');
    const valPlatformFee = document.getElementById('valPlatformFee');
    const valShipping = document.getElementById('valShipping');
    const valAdSpend = document.getElementById('valAdSpend');
    const valReturnCost = document.getElementById('valReturnCost');
    
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Handle Platform presets
    platformSelect.addEventListener('change', () => {
        if (platformSelect.value === 'amazon') {
            platformFeePercentInput.value = '15.0'; // Amazon referral fee avg
            platformFeeFixedInput.value = '0.00';
            shippingCostInput.value = '5.50'; // Estimated FBA fulfillment fee
        } else {
            platformFeePercentInput.value = '2.9'; // Shopify Payments avg
            platformFeeFixedInput.value = '0.30';
            shippingCostInput.value = '4.50';
        }
        calculateMetrics();
    });

    // Main calculation function
    function calculateMetrics() {
        const price = parseFloat(sellingPriceInput.value) || 0;
        const cogs = parseFloat(cogsInput.value) || 0;
        const shipping = parseFloat(shippingCostInput.value) || 0;
        const prep = parseFloat(prepCostInput.value) || 0;
        const adSpend = parseFloat(adSpendInput.value) || 0;
        const returnRate = (parseFloat(returnRateInput.value) || 0) / 100;
        const feePercent = (parseFloat(platformFeePercentInput.value) || 0) / 100;
        const feeFixed = parseFloat(platformFeeFixedInput.value) || 0;

        // Calculations
        const cogsPrepTotal = cogs + prep;
        const platformFee = (price * feePercent) + feeFixed;
        
        // Return loss calculation (assuming returned item costs restocking/shipping loss roughly equal to fulfillment or partial waste)
        const returnLossCost = (shipping + cogsPrepTotal * 0.2) * returnRate;
        
        const totalCosts = cogsPrepTotal + platformFee + shipping + adSpend + returnLossCost;
        const netProfit = price - totalCosts;
        
        const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;
        const totalInvestment = cogsPrepTotal + shipping + returnLossCost; // Base capital invested per unit
        const trueRoi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
        
        // Break-even ROAS = Selling Price / (Selling Price - Variable Costs excluding ad spend)
        const variableCostsNoAds = cogsPrepTotal + platformFee + shipping + returnLossCost;
        const contributionMargin = price - variableCostsNoAds;
        const breakEvenRoas = contributionMargin > 0 ? price / contributionMargin : 0;

        // Render UI Results
        netProfitEl.textContent = `$${netProfit.toFixed(2)}`;
        netProfitEl.style.color = netProfit >= 0 ? '#047857' : '#dc2626';
        
        netMarginEl.textContent = `${profitMargin.toFixed(2)}%`;
        trueRoiEl.textContent = `${trueRoi.toFixed(1)}%`;
        breakEvenRoasEl.textContent = breakEvenRoas > 0 ? `${breakEvenRoas.toFixed(2)}x` : 'N/A';
        totalCostsEl.textContent = `$${totalCosts.toFixed(2)}`;

        // Render Breakdown details
        valCogsPrep.textContent = `$${cogsPrepTotal.toFixed(2)}`;
        valPlatformFee.textContent = `$${platformFee.toFixed(2)}`;
        valShipping.textContent = `$${shipping.toFixed(2)}`;
        valAdSpend.textContent = `$${adSpend.toFixed(2)}`;
        valReturnCost.textContent = `$${returnLossCost.toFixed(2)}`;
    }

    // Event listeners on all inputs for instant real-time reactivity
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('input', calculateMetrics);
    });

    // Reset Defaults
    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        platformSelect.value = 'shopify';
        sellingPriceInput.value = '49.99';
        cogsInput.value = '10.00';
        shippingCostInput.value = '4.50';
        prepCostInput.value = '1.00';
        adSpendInput.value = '12.00';
        returnRateInput.value = '5';
        platformFeePercentInput.value = '2.9';
        platformFeeFixedInput.value = '0.30';
        calculateMetrics();
    });

    // Copy Summary Button
    copyBtn.addEventListener('click', () => {
        const summaryText = `E-Commerce Profit Summary:\n- Selling Price: $${sellingPriceInput.value}\n- Net Profit: ${netProfitEl.textContent}\n- Profit Margin: ${netMarginEl.textContent}\n- True ROI: ${trueRoiEl.textContent}\n- Break-Even ROAS: ${breakEvenRoasEl.textContent}`;
        
        navigator.clipboard.writeText(summaryText).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied to Clipboard!';
            copyBtn.style.backgroundColor = '#059669';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Initial calculation on load
    calculateMetrics();
});