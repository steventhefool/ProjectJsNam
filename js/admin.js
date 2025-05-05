const filterClass = document.getElementById("filterClass");
const filterEmail = document.getElementById("filterEmail");
const filterDate = document.getElementById("filterDate");
const filterBtn = document.getElementById("filterBtn");
const tableBody = document.getElementById("scheduleTable");

filterBtn.addEventListener("click", filterTable);

function filterTable() {
    const selectedClass = filterClass.value.toLowerCase();
    const inputEmail = filterEmail.value.toLowerCase();
    const inputDate = filterDate.value;

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
        const classCell = row.cells[0].textContent.toLowerCase();
        const dateCell = row.cells[1].textContent;
        const emailCell = row.cells[4].textContent.toLowerCase();

        const matchClass = selectedClass === "tất cả" || classCell.includes(selectedClass);
        const matchEmail = inputEmail === "" || emailCell.includes(inputEmail);
        const matchDate = inputDate === "" || dateCell === inputDate;

        row.style.display = (matchClass && matchEmail && matchDate) ? "" : "none";
    });
}
const scheduleData = [
    { class: "Yoga", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },
    { class: "Yoga", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },
    { class: "Yoga", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },
    { class: "Gym", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },
    { class: "Gym", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },
    { class: "Zumba", date: "2025-05-02", time: "14:00 - 16:00", name: "NGUYEN THANH BINH PHUOC", email: "tieucamieu@gmail.com" },

];

let currentPage = 1;
const recordsPerPage = 5;


function renderTable(page) {
    const start = (page - 1) * recordsPerPage;
    const end = page * recordsPerPage;
    const paginatedData = scheduleData.slice(start, end);

    const tableBody = document.getElementById('scheduleTable');
    tableBody.innerHTML = '';

    paginatedData.forEach(record => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50');

        row.innerHTML = `
        <td class="px-4 py-3 border-b">${record.class}</td>
        <td class="px-4 py-3 border-b">${record.date}</td>
        <td class="px-4 py-3 border-b">${record.time}</td>
        <td class="px-4 py-3 border-b">${record.name}</td>
        <td class="px-4 py-3 border-b">${record.email}</td>
        <td class="px-4 py-3 border-b text-blue-600">
          <a href="#" class="mr-2 hover:underline">Sửa</a>
          <a href="#" class="text-red-500 hover:underline">Xóa</a>
        </td>
      `;
        tableBody.appendChild(row);
    });

    document.getElementById('pageNumber').textContent = page;
}


document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(scheduleData.length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable(currentPage);
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable(currentPage);
    }
});


renderTable(currentPage);