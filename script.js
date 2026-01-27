const salesInput = document.getElementById("sales");
const hargaPasaranInput = document.getElementById("hargaPasaran");
const hargaSubsidiInput = document.getElementById("hargaSubsidi");
const resultDiv = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

// Auto calculate bila user taip
[salesInput, hargaPasaranInput, hargaSubsidiInput].forEach(input => {
  input.addEventListener("input", calculate);
});

// Fetch harga diesel dari API CSV data.gov.my
async function fetchHargaDiesel() {
  try {
    const response = await fetch("https://storage.data.gov.my/commodities/fuelprice.csv");
    const text = await response.text();

    const rows = text.trim().split("\n");
    const header = rows[0].split(",");
    const firstRow = rows[1].split(",");

    const idxDiesel = header.findIndex(h => h.toLowerCase().includes("diesel"));
    const idxSubsidi = header.findIndex(h => h.toLowerCase().includes("subsidi"));

    if (idxDiesel !== -1) {
      hargaPasaranInput.value = parseFloat(firstRow[idxDiesel]);
    } else {
      hargaPasaranInput.value = 2.88; // fallback
    }

    if (idxSubsidi !== -1) {
      hargaSubsidiInput.value = parseFloat(firstRow[idxSubsidi]);
    } else {
      hargaSubsidiInput.value = 2.15; // fallback
    }

    calculate();
  } catch (err) {
    console.error("Gagal fetch data:", err);
    hargaPasaranInput.value = 2.88;
    hargaSubsidiInput.value = 2.15;
    calculate();
  }
}

function calculate() {
  const sales = parseFloat(salesInput.value) || 0;
  const hargaPasaran = parseFloat(hargaPasaranInput.value) || 0;
  const hargaSubsidi = parseFloat(hargaSubsidiInput.value) || 0;

  if (hargaPasaran <= 0 || hargaSubsidi <= 0) {
    resultDiv.innerHTML = "<p>Sila masukkan harga yang sah.</p>";
    return;
  }

  const liter = sales / hargaPasaran;
  const subsidiPerLiter = hargaPasaran - hargaSubsidi;
  const subsidi = liter * subsidiPerLiter;
  const jumlahBayaran = sales - subsidi;

  resultDiv.innerHTML = `
    <p>Jumlah Liter: ${liter.toFixed(2)} L</p>
    <p>Subsidi: RM ${subsidi.toFixed(2)}</p>
    <p>Jumlah Bayaran: RM ${jumlahBayaran.toFixed(2)}</p>
  `;
}

// Reset button
resetBtn.addEventListener("click", () => {
  salesInput.value = "";
  fetchHargaDiesel(); // reset harga ikut API/fallback
  resultDiv.innerHTML = `
    <p>Jumlah Liter: -</p>
    <p>Subsidi: -</p>
    <p>Jumlah Bayaran: -</p>
  `;
});

// Panggil fetch masa page load

fetchHargaDiesel();


