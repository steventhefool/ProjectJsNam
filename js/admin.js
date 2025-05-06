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
let isEditing = false;
let editingIndex = null;
const scheduleData = getAllBookingsForAdmin();
let currentPage = 1;
const recordsPerPage = 5;

function renderTable(page) {
    const start = (page - 1) * recordsPerPage;
    const end = page * recordsPerPage;
    const allData = getAllBookingsForAdmin();
    const paginatedData = allData.slice(start, end);

    const tableBody = document.getElementById('scheduleTable');
    tableBody.innerHTML = '';

    paginatedData.forEach((record) => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50');

        row.innerHTML = `
            <td class="px-4 py-3 border-b">${record.class}</td>
            <td class="px-4 py-3 border-b">${record.date}</td>
            <td class="px-4 py-3 border-b">${record.time}</td>
            <td class="px-4 py-3 border-b">${record.fullName}</td>
            <td class="px-4 py-3 border-b">${record.email}</td>
            <td class="px-4 py-3 border-b text-blue-600">
                <a href="#" class="mr-2 hover:underline" onclick="editBookingAdmin('${record.userId}', ${record.localIndex})">Sửa</a>
                <a href="#" class="text-red-500 hover:underline" onclick="confirmDeleteBookingAdmin('${record.userId}', ${record.localIndex})">Xóa</a>
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
function getAllBookingsForAdmin() {
    const bookings = [];
    for (let key in localStorage) {
        if (key.startsWith("bookings_")) {
            const userId = key.replace("bookings_", "");
            const userBookings = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userBookings)) {
                userBookings.forEach((booking, index) => {
                    bookings.push({
                        ...booking,
                        userId,
                        localIndex: index
                    });
                });
            }
        }
    }
    return bookings;
}

function editBookingAdmin(userId, index) {
    const bookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    const booking = bookings[index];
    openBookingFormAdmin(booking, index, userId);
}

function confirmDeleteBookingAdmin(userId, index) {
    const modalWrapper = document.createElement('div');
    modalWrapper.id = "confirmModal";
    modalWrapper.style = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000; opacity: 1;";
    const modalContent = document.createElement('div');
    modalContent.style = "background:white;padding:2rem;border-radius:8px;width:300px;text-align:center;";
    modalContent.innerHTML = `
        <p style="color:black;">Bạn có chắc chắn muốn xóa lịch này không?</p>
        <div style="margin-top:1.5rem;display:flex;justify-content:center;gap:1rem; opacity: 1;">
            <button onclick="deleteBookingAdmin('${userId}', ${index})" style="background:red;color:black;padding:0.5rem 1rem;border:none;border-radius:5px;">Xóa</button>
            <button onclick="closeConfirmModal()" style="background:gray;color:black;padding:0.5rem 1rem;border:none;border-radius:5px;">Hủy</button>
        </div>
    `;

    modalWrapper.appendChild(modalContent);
    document.body.appendChild(modalWrapper);
}
function deleteBookingAdmin(userId, index) {
    const bookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    bookings.splice(index, 1);
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookings));
    renderTable(currentPage);
    closeConfirmModal();
}

function openBookingFormAdmin(booking, index, userId) {
    isEditing = true;
    editingIndex = index;

    const modalWrapper = document.createElement('div');
    modalWrapper.id = "bookingModal";
    modalWrapper.style = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000; opacity: 1;";

    const modalContent = document.createElement('div');
    modalContent.style = "background:white;padding:2rem;border-radius:8px;width:340px;position:relative;";
    modalContent.innerHTML = `
    <div id="bookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg w-80 shadow-lg">
      <h2 class="text-lg font-semibold mb-4">${isEditing ? 'Sửa lịch tập' : 'Đặt lịch mới'}</h2>
      <form id="bookingForm" class="space-y-4" style="color: black;">
        <div id="errorBox" class="text-red-600 text-sm"></div>
  
        <div>
          <label class="font-medium block mb-1">Lớp học</label>
          <select id="classSelect" required class="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="">Chọn lớp học</option>
          </select>
        </div>
  
        <div>
          <label class="font-medium block mb-1">Ngày tập</label>
          <input type="date" id="dateInput" required class="w-full px-3 py-2 border border-gray-300 rounded">
        </div>
  
        <div>
          <label class="font-medium block mb-1">Khung giờ</label>
          <select id="timeSelect" required class="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="">Chọn khung giờ</option>
            <option value="06:00 - 07:00">06:00 - 07:00</option>
            <option value="07:00 - 08:00">07:00 - 08:00</option>
            <option value="17:00 - 18:00">17:00 - 18:00</option>
            <option value="18:00 - 19:00">18:00 - 19:00</option>
          </select>
        </div>
  
        <div>
          <label class="font-medium block mb-1">Họ tên</label>
          <input type="text" id="fullName" required class="w-full px-3 py-2 border border-gray-300 rounded">
        </div>
  
        <div>
          <label class="font-medium block mb-1">Email</label>
          <input type="email" id="emailInput" required class="w-full px-3 py-2 border border-gray-300 rounded">
        </div>
  
        <div class="flex justify-end space-x-2 pt-2">
          <button type="button" onclick="closeBookingForm()" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ${isEditing ? 'Cập nhật' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  </div>
    `;

    modalWrapper.appendChild(modalContent);
    document.body.appendChild(modalWrapper);
    const services = JSON.parse(localStorage.getItem("services")) || [];
    const classSelectEl = document.getElementById("classSelect");

    classSelectEl.innerHTML = `<option value="">Chọn lớp học</option>`;
    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.name;
        option.textContent = service.name;
        classSelectEl.appendChild(option);
    });

    document.getElementById('classSelect').value = booking.class || "";
    document.getElementById('dateInput').value = booking.date || "";
    document.getElementById('timeSelect').value = booking.time || "";
    document.getElementById('fullName').value = booking.fullName || "";
    document.getElementById('emailInput').value = booking.email || "";

    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveBookingAdmin(userId, index);
    });
}



function saveBookingAdmin(userId, index) {
    const bookings = JSON.parse(localStorage.getItem(`bookings_${userId}`)) || [];
    const booking = bookings[index];
    const updatedBooking = {
        class: document.getElementById('classSelect').value,
        date: document.getElementById('dateInput').value,
        time: document.getElementById('timeSelect').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('emailInput').value,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: new Date().toISOString()
    };

    bookings[index] = updatedBooking;
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookings));
    closeBookingForm();
    renderTable(currentPage);
}

function closeBookingForm() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.remove();
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.remove();
    }
}
function generateBookingStats() {
    const services = JSON.parse(localStorage.getItem("services")) || [];
    const allKeys = Object.keys(localStorage);
    const bookingKeys = allKeys.filter(key => key.startsWith("bookings_"));

    const stats = {};
    services.forEach(service => {
        stats[service.name] = 0;
    });

    bookingKeys.forEach(key => {
        const bookings = JSON.parse(localStorage.getItem(key)) || [];
        bookings.forEach(b => {
            if (stats[b.class] !== undefined) {
                stats[b.class]++;
            } else {
                stats[b.class] = 1;
            }
        });
    });

    return stats;
}
function renderStatsUI() {
    const stats = generateBookingStats();
    const statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = "";

    Object.entries(stats).forEach(([className, count]) => {
        const color = getClassColor(className);
        statsContainer.innerHTML += `
            <div class="bg-white p-4 rounded shadow text-center">
                <p class="text-gray-500">Tổng số lịch ${className}</p>
                <p class="text-2xl font-bold ${color}">${count}</p>
            </div>
        `;
    });

    renderChart(stats);
}

function getClassColor(className) {
    const map = {
        "Gym": "text-blue-600",
        "Yoga": "text-green-600",
        "Zumba": "text-purple-600"
    };
    return map[className] || "text-blue-600";
}
function renderChart(stats) {
    const ctx = document.getElementById("classChart").getContext("2d");
    if (window.bookingChart) window.bookingChart.destroy();

    window.bookingChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: "Số lượng lịch đặt",
                data: Object.values(stats),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    renderStatsUI();
});

