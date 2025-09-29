(function() {
  emailjs.init("JhXbAiQkeFaWxQPX2"); // Saját EmailJS kulcsod
})();

document.getElementById('sendEmail').addEventListener('click', () => {
  fetch('data.csv')
    .then(response => {
      if (!response.ok) throw new Error(`Nem sikerült betölteni a CSV-t: ${response.status}`);
      return response.text();
    })
    .then(csvText => {
      // CSV → 2D tömb
      const rows = csvText.trim().split('\n').map(r => r.split(';'));
      const header = rows[0,0];      // ["Név", "Dátum"]
      const dataRows = rows.slice(1);

      // Szűrés a 2. oszlop (index = 1) alapján
      const filteredRows = filterByDate(dataRows);

      // Új CSV (fejléc + szűrt sorok)
      const resultCSV = [header, ...filteredRows].map(r => r.join(';')).join('\n');

      // Küldés EmailJS-en
      return emailjs.send("service_qruvx06", "template_3mwnm0f", {
        csv_content: resultCSV
      });
    })
    .then(() => alert("Szűrt CSV sikeresen elküldve!"))
    .catch(err => {
      console.error("Error:", err);
      alert("Hiba: " + err.message);
    });
});

/**
 * Csak azokat a sorokat tartja meg,
 * ahol a dátum (oszlop index = 1) ±2 hónapon belül van.
 */
function filterByDate(rows) {
  const now = new Date();
  const currentYear = now.getFullYear();

  const twoMonthsBefore = new Date(now);
  twoMonthsBefore.setMonth(now.getMonth() - 2);

  const twoMonthsAfter = new Date(now);
  twoMonthsAfter.setMonth(now.getMonth() + 2);

  return rows.filter(row => {
    const dateStr = row[1]?.trim(); // fix: 2. oszlop = "Dátum"
    if (!/^\d{2}\.\d{2}\.$/.test(dateStr)) return false;

    const [MM, DDwithDot] = dateStr.split('.');
    const MMnum = parseInt(MM, 10);
    const DDnum = parseInt(DDwithDot, 10);

    let rowDate = new Date(currentYear, MMnum - 1, DDnum);

    // ha a dátum már elmúlt, de még időszerű → jövő évhez tartozhat
    if (rowDate < twoMonthsBefore) {
      rowDate.setFullYear(currentYear + 1);
    }

    return rowDate >= twoMonthsBefore && rowDate <= twoMonthsAfter;
  });
}
