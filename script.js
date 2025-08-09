fetch('data.csv')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    const rows = text.trim().split('\n').map(row => row.split(';'));
    displayTable(rows);
  })
  .catch(err => {
    document.getElementById('output').innerHTML = `<p style="color:red;">Error loading CSV: ${err}</p>`;
  });

function displayTable(rows) {
  let html = '<table>';
  rows.forEach((row, index) => {
    html += '<tr>';
    row.forEach(cell => {
      if (index === 0) {
        html += `<th>${cell.trim()}</th>`;
      } else {
        html += `<td>${cell.trim()}</td>`;
      }
    });
    html += '</tr>';
  });
  html += '</table>';

  document.getElementById('output').innerHTML = html;
}

// Initialize EmailJS with your Public Key
(function() {
  emailjs.init("JhXbAiQkeFaWxQPX2"); // Replace with your actual Public Key
})();

document.getElementById('sendEmail').addEventListener('click', () => {
  fetch('data.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status}`);
      }
      return response.text();
    })
    .then(csvContent => {
      // Prepare the template parameters
      const templateParams = {
        csv_content: csvContent // This matches the variable name in your EmailJS template
      };

      return emailjs.send("service_qruvx06", "template_3mwnm0f", templateParams);
    })
    .then(() => {
      alert('CSV sent successfully!');
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Failed to send CSV. See console for details.');
    });
});
