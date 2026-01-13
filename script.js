// Rounding ikut aturan baru
function roundCustom(value) {
  let ringgit = Math.floor(value);
  let sen = Math.round((value - ringgit) * 100);

  let roundedSen;

  if (sen <= 2) {
    roundedSen = 0;
  } else if (sen >= 3 && sen <= 4) {
    roundedSen = 5;
  } else if (sen >= 6 && sen <= 7) {
    roundedSen = 5;
  } else if (sen >= 8 && sen <= 9) {
    roundedSen = 10;
  } else {
    // selebihnya ikut pembundaran ke 0.05 terdekat
    roundedSen = Math.round(sen / 5) * 5;
    if (roundedSen === 100) {
      ringgit += 1;
      roundedSen = 0;
    }
  }

  return ringgit + (roundedSen / 100);
}

function roundDown(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

function kira() {
  const hargaSemasa = parseFloat(document.getElementById('hargaSemasa').value);
  const hargaSubsidi = parseFloat(document.getElementById('hargaSubsidi').value);
  const sales = parseFloat(document.getElementById('sales').value);

  if (isNaN(sales) || sales <= 0) {
    alert("Sila masukkan jumlah Sales (RM) yang sah.");
    return;
  }

  // Gran Total
  const granTotal = sales;

  // Liter = Sales ÷ Harga Semasa
  const liter = sales / hargaSemasa;

  // Subsidi per liter
  const subsidiPerLiter = hargaSemasa - hargaSubsidi;

  // Jumlah subsidi
  const subsidi = subsidiPerLiter * liter;

  // Amount Paid asal
  const amountPaidRaw = sales - subsidi;

  // Amount Paid rounded ikut aturan custom
  const amountPaidRounded = roundCustom(amountPaidRaw);

  // Rounding adjustment
  const rounding = (amountPaidRounded - amountPaidRaw).toFixed(2);

  // Peratus subsidi
  const percentRaw = (subsidi / sales) * 100;
  const percent = roundDown(percentRaw, 2);

  document.getElementById('granTotal').textContent = granTotal.toFixed(2);
  document.getElementById('rounding').textContent = rounding;
  document.getElementById('subsidi').textContent = subsidi.toFixed(2);
  document.getElementById('amountPaid').textContent = amountPaidRounded.toFixed(2);
  document.getElementById('percent').textContent = percent.toFixed(2);
}

function resetForm() {
  document.getElementById('hargaSemasa').value = 2.890;
  document.getElementById('hargaSubsidi').value = 2.15;
  document.getElementById('sales').value = "";
  document.getElementById('granTotal').textContent = "0.00";
  document.getElementById('rounding').textContent = "0.00";
  document.getElementById('subsidi').textContent = "0.00";
  document.getElementById('amountPaid').textContent = "0.00";
  document.getElementById('percent').textContent = "0.00";
}

// event listener
document.getElementById('btnKira').addEventListener("click", kira);
document.getElementById('btnReset').addEventListener("click", resetForm);

// tekan ENTER terus kira
document.getElementById('sales').addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    kira();
  }
});