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
        <h3>${isEditing ? 'Sửa lịch tập' : 'Đặt lịch mới'}</h3>
        <form id="bookingForm" style="color:black;">
            <div id="errorBox" style="color:red;margin-bottom:1rem;"></div>

            <div style="margin-bottom:1rem;">
                <label>Lớp học</label><br>
                <select id="classSelect" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                    <option value="">Chọn lớp học</option>
                    <option value="Gym">Gym</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Zumba">Zumba</option>
                </select>
            </div>
            <div style="margin-bottom:1rem;">
                <label>Ngày tập</label><br>
                <input type="date" id="dateInput" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
            </div>
            <div style="margin-bottom:1rem;">
                <label>Khung giờ</label><br>
                <select id="timeSelect" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
                    <option value="">Chọn khung giờ</option>
                    <option value="06:00 - 07:00">06:00 - 07:00</option>
                    <option value="07:00 - 08:00">07:00 - 08:00</option>
                    <option value="17:00 - 18:00">17:00 - 18:00</option>
                    <option value="18:00 - 19:00">18:00 - 19:00</option>
                </select>
            </div>
            <div style="margin-bottom:1rem;">
                <label>Họ tên</label><br>
                <input type="text" id="fullName" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
            </div>
            <div style="margin-bottom:1rem;">
                <label>Email</label><br>
                <input type="email" id="emailInput" required style="width:100%;padding:0.5rem;margin-top:0.5rem;">
            </div>
            <div style="display:flex;justify-content:end;gap:1rem; opacity: 1;">
                <button type="button" onclick="closeBookingForm()" style="background:#6b7280;color:black;padding:0.5rem 1rem;border:none;border-radius:5px;">Hủy</button>
                <button type="submit" style="background:#3b82f6;color:black;padding:0.5rem 1rem;border:none;border-radius:5px;">${isEditing ? 'Cập nhật' : 'Lưu'}</button>
            </div>
        </form>
    `;

    modalWrapper.appendChild(modalContent);
    document.body.appendChild(modalWrapper);

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