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
