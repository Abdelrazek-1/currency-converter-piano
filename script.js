const country_list = { 
    "USD": "US", 
    "EGP": "EG", 
    "SAR": "SA", 
    "EUR": "FR", 
    "GBP": "GB" 
};

const fromCurrency = document.querySelector("#fromCurrency");
const toCurrency = document.querySelector("#toCurrency");
const getRateBtn = document.querySelector("#getRateBtn");
const amountInput = document.querySelector("#amountInput");
const exchangeRateText = document.querySelector(".exchange-rate");

function loadFlag(element) {
    let code = element.value;
    let imgTag = element.parentElement.querySelector("img"); 
    imgTag.src = `https://flagcdn.com/w20/${country_list[code].toLowerCase()}.png`;
}

window.addEventListener("load", () => {
    for (let code in country_list) {
        let selectedFrom = code == "GBP" ? "selected" : ""; 
        let selectedTo = code == "EGP" ? "selected" : "";
        fromCurrency.insertAdjacentHTML("beforeend", `<option value="${code}" ${selectedFrom}>${code}</option>`);
        toCurrency.insertAdjacentHTML("beforeend", `<option value="${code}" ${selectedTo}>${code}</option>`);
    }
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

fromCurrency.addEventListener("change", (e) => loadFlag(e.target));
toCurrency.addEventListener("change", (e) => loadFlag(e.target));

getRateBtn.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

async function getExchangeRate() {
    let amountVal = amountInput.value || 1;
    exchangeRateText.innerText = "Getting rate...";
    
    const apiKey = "11756bc60d536675e1e8c2d6";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency.value}/${toCurrency.value}/${amountVal}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.result === "success") {
            let totalRate = data.conversion_result.toFixed(2);
            
            // جلب التاريخ والوقت
            let updateTime = data.time_last_update_utc 
                             ? data.time_last_update_utc.slice(0, 16) 
                             : new Date().toUTCString().slice(0, 16);

            // إجبار المربع على التوسع وإظهار السطرين باستخدام التنسيق المباشر
            exchangeRateText.style.height = "auto"; 
            exchangeRateText.style.display = "block";
            exchangeRateText.style.padding = "15px 10px";

            exchangeRateText.innerHTML = `
                <div style="font-size: 18px; margin-bottom: 5px;">
                    ${amountVal} ${fromCurrency.value} = ${totalRate} ${toCurrency.value}
                </div>
                <div style="font-size: 12px; color: #cbd5e0; font-weight: 400; opacity: 0.8;">
                    Last Updated: ${updateTime}
                </div>
            `;
        }
    } catch (error) {
        exchangeRateText.innerText = "Something went wrong";
    }
}